import { NextRequest, NextResponse } from "next/server";

const VIPPS_BASE_URL = process.env.VIPPS_IS_TEST === "true"
  ? "https://apitest.vipps.no"
  : "https://api.vipps.no";

function vippsConfigured() {
  return !!(
    process.env.VIPPS_CLIENT_ID &&
    process.env.VIPPS_CLIENT_SECRET &&
    process.env.VIPPS_SUBSCRIPTION_KEY &&
    process.env.VIPPS_MERCHANT_SERIAL_NUMBER
  );
}

async function getVippsToken(): Promise<string> {
  const credentials = Buffer.from(
    `${process.env.VIPPS_CLIENT_ID}:${process.env.VIPPS_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${VIPPS_BASE_URL}/accesstoken/get`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Ocp-Apim-Subscription-Key": process.env.VIPPS_SUBSCRIPTION_KEY!,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Vipps token error: ${res.status}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    if (!vippsConfigured()) {
      return NextResponse.json(
        { error: "Vipps not configured" },
        { status: 503 }
      );
    }

    const { amount, locale = "en" } = (await req.json()) as {
      amount?: number;
      locale?: string;
    };

    if (!amount || typeof amount !== "number" || amount < 10 || amount > 100000) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const token = await getVippsToken();
    const reference = crypto.randomUUID();
    const siteUrl = new URL(req.url).origin;

    const body = {
      amount: {
        currency: "NOK",
        value: amount * 100, // øre
      },
      paymentMethod: { type: "WALLET" },
      reference,
      returnUrl: `${siteUrl}/api/vipps/callback?reference=${reference}&locale=${locale}`,
      userFlow: "WEB_REDIRECT",
      paymentDescription: "Donation to Dawah Norway",
    };

    const res = await fetch(`${VIPPS_BASE_URL}/epayment/v1/payments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Ocp-Apim-Subscription-Key": process.env.VIPPS_SUBSCRIPTION_KEY!,
        "Merchant-Serial-Number": process.env.VIPPS_MERCHANT_SERIAL_NUMBER!,
        "Content-Type": "application/json",
        "Idempotency-Key": reference,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Vipps initiate error:", err);
      return NextResponse.json({ error: "Payment initiation failed" }, { status: 502 });
    }

    const data = (await res.json()) as { redirectUrl?: string };
    return NextResponse.json({ redirectUrl: data.redirectUrl });
  } catch (error) {
    console.error("Vipps initiate:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
