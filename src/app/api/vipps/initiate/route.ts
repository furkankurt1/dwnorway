import { NextRequest, NextResponse } from "next/server";
import {
  VIPPS_BASE_URL,
  vippsConfigured,
  getVippsToken,
  vippsApiHeaders,
} from "@/lib/vipps";

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

    if (
      !amount ||
      typeof amount !== "number" ||
      amount < 10 ||
      amount > 100000
    ) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const token = await getVippsToken();
    const reference = crypto.randomUUID();
    const siteUrl = new URL(req.url).origin;

    const body = {
      amount: { currency: "NOK", value: amount * 100 },
      paymentMethod: { type: "WALLET" },
      reference,
      returnUrl: `${siteUrl}/api/vipps/callback?reference=${reference}&locale=${locale}`,
      userFlow: "WEB_REDIRECT",
      paymentDescription:
        locale === "no"
          ? "Donasjon til Dawah Norway"
          : "Donation to Dawah Norway",
    };

    const res = await fetch(`${VIPPS_BASE_URL}/epayment/v1/payments`, {
      method: "POST",
      headers: { ...vippsApiHeaders(token), "Idempotency-Key": reference },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Vipps initiate error:", err);
      return NextResponse.json(
        { error: "Payment initiation failed" },
        { status: 502 }
      );
    }

    const data = (await res.json()) as { redirectUrl?: string };
    return NextResponse.json({ redirectUrl: data.redirectUrl });
  } catch (error) {
    console.error("Vipps initiate:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
