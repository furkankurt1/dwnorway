import { NextRequest, NextResponse } from "next/server";
import { VIPPS_BASE_URL, getVippsToken, vippsApiHeaders } from "@/lib/vipps";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");
  const locale = searchParams.get("locale") ?? "en";
  const siteUrl = new URL(req.url).origin;

  if (!reference) {
    return NextResponse.redirect(`${siteUrl}/${locale}/donate?status=failed`);
  }

  try {
    const token = await getVippsToken();

    const res = await fetch(
      `${VIPPS_BASE_URL}/epayment/v1/payments/${reference}`,
      {
        headers: vippsApiHeaders(token),
      }
    );

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
