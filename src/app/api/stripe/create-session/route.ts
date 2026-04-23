import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const { amount, locale = "en" } = await req.json();

    if (!amount || typeof amount !== "number" || amount < 10 || amount > 100000) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      console.error("STRIPE_SECRET_KEY missing");
      return NextResponse.json({ error: "Payment unavailable" }, { status: 503 });
    }

    const stripe = new Stripe(secretKey);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dawahnorge.no";

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded_page",
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "nok",
            product_data: {
              name: "Dawah Norway Donation",
              description: "An invitation to Islam — thank you for your support",
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      return_url: `${siteUrl}/${locale}/donate/complete?session_id={CHECKOUT_SESSION_ID}`,
      locale: locale === "no" ? "nb" : "en",
      automatic_tax: { enabled: false },
      metadata: {
        source: "dawah_norway_donate",
        locale,
      },
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("Stripe create-session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
