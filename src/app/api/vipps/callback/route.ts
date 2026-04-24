import { NextRequest, NextResponse } from "next/server";

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

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");
  const locale = searchParams.get("locale") ?? "en";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dawahnorway.com";

  if (!reference) {
    return NextResponse.redirect(`${siteUrl}/${locale}/donate?status=failed`);
  }

  try {
    const token = await getVippsToken();

    const res = await fetch(`${VIPPS_BASE_URL}/epayment/v1/payments/${reference}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Ocp-Apim-Subscription-Key": process.env.VIPPS_SUBSCRIPTION_KEY!,
        "Merchant-Serial-Number": process.env.VIPPS_MERCHANT_SERIAL_NUMBER!,
      },
    });

    if (!res.ok) {
      return NextResponse.redirect(`${siteUrl}/${locale}/donate?status=failed`);
    }

    const data = (await res.json()) as { state?: string };
    const state = data.state;

    if (state === "AUTHORIZED" || state === "TERMINATED") {
      return NextResponse.redirect(`${siteUrl}/${locale}/donate/success`);
    }

    return NextResponse.redirect(`${siteUrl}/${locale}/donate?status=failed`);
  } catch (error) {
    console.error("Vipps callback:", error);
    return NextResponse.redirect(`${siteUrl}/${locale}/donate?status=failed`);
  }
}
