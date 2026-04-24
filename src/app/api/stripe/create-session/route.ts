import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const { amount, locale = "en", frequency = "once" } = (await req.json()) as {
      amount?: number;
      locale?: string;
      frequency?: "once" | "monthly";
    };

    if (!amount || typeof amount !== "number" || amount < 10 || amount > 100000) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }
    if (frequency !== "once" && frequency !== "monthly") {
      return NextResponse.json({ error: "Invalid frequency" }, { status: 400 });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      console.error("STRIPE_SECRET_KEY missing");
      return NextResponse.json({ error: "Payment unavailable" }, { status: 503 });
    }

    const stripe = new Stripe(secretKey, {
      httpClient: Stripe.createFetchHttpClient(),
    });
    const siteUrl = new URL(req.url).origin;
    const isNo = locale === "no";
    const isRecurring = frequency === "monthly";

    const productName = isRecurring
      ? isNo ? "Dawah Norway — Månedlig donasjon" : "Dawah Norway — Monthly Donation"
      : isNo ? "Dawah Norway — Donasjon" : "Dawah Norway — Donation";

    const productDescription = isNo
      ? "En invitasjon til Islam — takk for din støtte."
      : "An invitation to Islam — thank you for your support.";

    const submitMessage = isNo
      ? "100% av bidraget ditt går til dawah-arbeidet vårt. Må Allah belønne deg."
      : "100% of your donation supports our dawah work. May Allah reward you.";

    const baseParams: Stripe.Checkout.SessionCreateParams = {
      ui_mode: "embedded_page",
      return_url: `${siteUrl}/${locale}/donate/complete?session_id={CHECKOUT_SESSION_ID}`,
      locale: isNo ? "nb" : "en",
      billing_address_collection: "auto",
      automatic_tax: { enabled: false },
      custom_text: {
        submit: { message: submitMessage },
      },
      metadata: {
        source: "dawah_norway_donate",
        frequency,
        locale,
      },
    };

    const session = await stripe.checkout.sessions.create(
      isRecurring
        ? {
            ...baseParams,
            mode: "subscription",
            line_items: [
              {
                price_data: {
                  currency: "nok",
                  recurring: { interval: "month" },
                  product_data: {
                    name: productName,
                    description: productDescription,
                  },
                  unit_amount: amount * 100,
                },
                quantity: 1,
              },
            ],
            subscription_data: {
              description: isNo ? "Månedlig donasjon til Dawah Norway" : "Monthly donation to Dawah Norway",
              metadata: { source: "dawah_norway_donate", locale },
            },
          }
        : {
            ...baseParams,
            mode: "payment",
            line_items: [
              {
                price_data: {
                  currency: "nok",
                  product_data: {
                    name: productName,
                    description: productDescription,
                  },
                  unit_amount: amount * 100,
                },
                quantity: 1,
              },
            ],
            payment_intent_data: {
              statement_descriptor_suffix: "DAWAH NORWAY",
              description: isNo ? "Donasjon til Dawah Norway" : "Donation to Dawah Norway",
            },
          }
    );

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("Stripe create-session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
