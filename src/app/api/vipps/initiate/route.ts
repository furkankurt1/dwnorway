import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

const VIPPS_BASE_URL = process.env.VIPPS_IS_TEST === "true"
  ? "https://apitest.vipps.no"
  : "https://api.vipps.no";

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

  const data = await res.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const { amount, locale = "en" } = await req.json();

    if (!amount || typeof amount !== "number" || amount < 100 || amount > 100000) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const token = await getVippsToken();
    const reference = randomUUID();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dawahnorge.no";

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

    const data = await res.json();
    return NextResponse.json({ redirectUrl: data.redirectUrl });
  } catch (error) {
    console.error("Vipps initiate:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
