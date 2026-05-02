import { NextRequest, NextResponse } from "next/server";
import {
  VIPPS_BASE_URL,
  vippsConfigured,
  getVippsToken,
  vippsApiHeaders,
} from "@/lib/vipps";

const AGREEMENT_COOKIE = "vipps_agreement_id";

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
    const idempotencyKey = crypto.randomUUID();
    const orderId = crypto.randomUUID();
    const siteUrl = new URL(req.url).origin;
    const valueOre = amount * 100;

    const body = {
      pricing: {
        type: "LEGACY",
        amount: valueOre,
        currency: "NOK",
      },
      interval: { unit: "MONTH", count: 1 },
      merchantRedirectUrl: `${siteUrl}/api/vipps/agreement/callback?locale=${locale}`,
      merchantAgreementUrl: `${siteUrl}/${locale}/donation-agreement`,
      productName:
        locale === "no"
          ? "Månedlig donasjon til Dawah Norway"
          : "Monthly donation to Dawah Norway",
      productDescription:
        locale === "no"
          ? "Fast månedlig støtte til dawah- og opplysningsarbeid i Norge."
          : "Recurring monthly support for dawah and educational work in Norway.",
      initialCharge: {
        amount: valueOre,
        currency: "NOK",
        transactionType: "DIRECT_CAPTURE",
        description:
          locale === "no" ? "Første donasjon" : "First donation",
        orderId,
      },
    };

    const res = await fetch(`${VIPPS_BASE_URL}/recurring/v3/agreements`, {
      method: "POST",
      headers: { ...vippsApiHeaders(token), "Idempotency-Key": idempotencyKey },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Vipps agreement error:", err);
      return NextResponse.json(
        { error: "Agreement creation failed" },
        { status: 502 }
      );
    }

    const data = (await res.json()) as {
      agreementId?: string;
      vippsConfirmationUrl?: string;
    };

    if (!data.agreementId || !data.vippsConfirmationUrl) {
      return NextResponse.json(
        { error: "Unexpected Vipps response" },
        { status: 502 }
      );
    }

    const response = NextResponse.json({ redirectUrl: data.vippsConfirmationUrl });

    // Cookie carries the agreement id back to /api/vipps/agreement/callback so
    // we can verify state without including the id in a public redirect URL.
    response.cookies.set(AGREEMENT_COOKIE, data.agreementId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Vipps agreement:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
