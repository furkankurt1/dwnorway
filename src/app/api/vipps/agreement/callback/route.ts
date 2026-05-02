import { NextRequest, NextResponse } from "next/server";
import { VIPPS_BASE_URL, getVippsToken, vippsApiHeaders } from "@/lib/vipps";

const AGREEMENT_COOKIE = "vipps_agreement_id";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") ?? "en";
  const siteUrl = new URL(req.url).origin;

  const agreementId = req.cookies.get(AGREEMENT_COOKIE)?.value;

  if (!agreementId) {
    return NextResponse.redirect(`${siteUrl}/${locale}/donate?status=failed`);
  }

  try {
    const token = await getVippsToken();

    const res = await fetch(
      `${VIPPS_BASE_URL}/recurring/v3/agreements/${agreementId}`,
      {
        headers: vippsApiHeaders(token),
      }
    );

    if (!res.ok) {
      return NextResponse.redirect(`${siteUrl}/${locale}/donate?status=failed`);
    }

    const data = (await res.json()) as { status?: string };

    // Recurring v3 statuses: PENDING, ACTIVE, EXPIRED, STOPPED.
    // ACTIVE means the user confirmed and the initialCharge succeeded.
    const successStates = new Set(["ACTIVE"]);

    const target = successStates.has(data.status ?? "")
      ? `${siteUrl}/${locale}/donate/success?type=agreement`
      : `${siteUrl}/${locale}/donate?status=failed`;

    const response = NextResponse.redirect(target);
    // Clear the cookie either way — it has served its purpose.
    response.cookies.set(AGREEMENT_COOKIE, "", { path: "/", maxAge: 0 });
    return response;
  } catch (error) {
    console.error("Vipps agreement callback:", error);
    return NextResponse.redirect(`${siteUrl}/${locale}/donate?status=failed`);
  }
}
