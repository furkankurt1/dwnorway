export const VIPPS_BASE_URL =
  process.env.VIPPS_IS_TEST === "true"
    ? "https://apitest.vipps.no"
    : "https://api.vipps.no";

export function vippsConfigured(): boolean {
  return !!(
    process.env.VIPPS_CLIENT_ID &&
    process.env.VIPPS_CLIENT_SECRET &&
    process.env.VIPPS_SUBSCRIPTION_KEY &&
    process.env.VIPPS_MERCHANT_SERIAL_NUMBER
  );
}

let cachedToken: { value: string; expiresAt: number } | null = null;

export async function getVippsToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }

  // Vipps' /accesstoken/get is *not* OAuth Basic — it expects client_id and
  // client_secret as discrete headers alongside Ocp-Apim-Subscription-Key.
  // Sending Basic auth returns 401 "Missing client_id or client_secret".
  const res = await fetch(`${VIPPS_BASE_URL}/accesstoken/get`, {
    method: "POST",
    headers: {
      client_id: process.env.VIPPS_CLIENT_ID!,
      client_secret: process.env.VIPPS_CLIENT_SECRET!,
      "Ocp-Apim-Subscription-Key": process.env.VIPPS_SUBSCRIPTION_KEY!,
      "Merchant-Serial-Number": process.env.VIPPS_MERCHANT_SERIAL_NUMBER!,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Vipps token error: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as {
    access_token: string;
    expires_on?: string;
  };

  // expires_on is a unix timestamp (seconds) string. Fall back to 50 min if missing.
  const expiresAt = data.expires_on
    ? parseInt(data.expires_on, 10) * 1000
    : Date.now() + 50 * 60 * 1000;

  cachedToken = { value: data.access_token, expiresAt };
  return data.access_token;
}

export function vippsApiHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    "Ocp-Apim-Subscription-Key": process.env.VIPPS_SUBSCRIPTION_KEY!,
    "Merchant-Serial-Number": process.env.VIPPS_MERCHANT_SERIAL_NUMBER!,
    "Vipps-System-Name": "dawah-norway-website",
    "Vipps-System-Version": "1.0.0",
    "Vipps-System-Plugin-Name": "custom-nextjs",
    "Vipps-System-Plugin-Version": "1.0.0",
    "Content-Type": "application/json",
  };
}
