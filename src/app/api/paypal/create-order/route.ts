import { NextRequest, NextResponse } from "next/server";

const PAYPAL_API = process.env.PAYPAL_ENV === "sandbox"
  ? "https://api-m.sandbox.paypal.com"
  : "https://api-m.paypal.com";

async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { access_token?: string };
  return data.access_token ?? null;
}

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

    const token = await getAccessToken();
    if (!token) {
      return NextResponse.json({ error: "PayPal not configured" }, { status: 503 });
    }

    const siteUrl = new URL(req.url).origin;
    const isNo = locale === "no";
    const isRecurring = frequency === "monthly";

    // Recurring donations require a billing plan. If not configured, fall back to one-time.
    if (isRecurring) {
      const planId = process.env.PAYPAL_MONTHLY_PLAN_ID;
      if (!planId) {
        return NextResponse.json(
          { error: "PayPal recurring plan not configured" },
          { status: 503 }
        );
      }

      const res = await fetch(`${PAYPAL_API}/v1/billing/subscriptions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan_id: planId,
          custom_id: `dawah_${frequency}_${locale}_${amount}`,
          application_context: {
            brand_name: "Dawah Norway",
            locale: isNo ? "nb-NO" : "en-US",
            return_url: `${siteUrl}/${locale}/donate/complete?provider=paypal`,
            cancel_url: `${siteUrl}/${locale}/donate?status=failed`,
            user_action: "SUBSCRIBE_NOW",
          },
        }),
      });
      if (!res.ok) {
        console.error("PayPal subscription create failed:", await res.text());
        return NextResponse.json({ error: "PayPal error" }, { status: 502 });
      }
      const data = (await res.json()) as { links?: { rel: string; href: string }[] };
      const approveUrl = data.links?.find((l) => l.rel === "approve")?.href;
      return NextResponse.json({ approveUrl });
    }

    const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: { currency_code: "NOK", value: amount.toFixed(2) },
            description: isNo ? "Donasjon til Dawah Norway" : "Donation to Dawah Norway",
          },
        ],
        application_context: {
          brand_name: "Dawah Norway",
          locale: isNo ? "nb-NO" : "en-US",
          return_url: `${siteUrl}/${locale}/donate/complete?provider=paypal`,
          cancel_url: `${siteUrl}/${locale}/donate?status=failed`,
          user_action: "PAY_NOW",
          shipping_preference: "NO_SHIPPING",
        },
      }),
    });
    if (!res.ok) {
      console.error("PayPal order create failed:", await res.text());
      return NextResponse.json({ error: "PayPal error" }, { status: 502 });
    }
    const data = (await res.json()) as { links?: { rel: string; href: string }[] };
    const approveUrl = data.links?.find((l) => l.rel === "approve")?.href;
    return NextResponse.json({ approveUrl });
  } catch (error) {
    console.error("PayPal create-order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
