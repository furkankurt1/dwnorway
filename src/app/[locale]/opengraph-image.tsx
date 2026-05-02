import { ImageResponse } from "next/og";
import { getSeo } from "@/config/seo";

export const runtime = "edge";
export const alt = "Dawah Norway — An Invitation to Islam";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const seo = getSeo(locale, "/");
  const isNo = locale === "no";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0a1628 0%, #1a2942 45%, #4a3a1c 100%)",
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "12px",
              height: "60px",
              background: "#bfa055",
              borderRadius: "4px",
            }}
          />
          <div
            style={{
              fontSize: "32px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: "#bfa055",
            }}
          >
            {isNo ? "DAWAH NORGE" : "DAWAH NORWAY"}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: "1000px",
            }}
          >
            {seo.title}
          </div>
          <div
            style={{
              fontSize: "26px",
              lineHeight: 1.4,
              color: "rgba(255, 255, 255, 0.82)",
              maxWidth: "950px",
            }}
          >
            {seo.description.length > 180
              ? seo.description.slice(0, 177) + "…"
              : seo.description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              fontSize: "22px",
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            {isNo
              ? "dawahnorway.com — Lær om Islam i Norge"
              : "dawahnorway.com — Learn About Islam in Norway"}
          </div>
          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            {["Oslo", "Trondheim", "Stavanger"].map((city) => (
              <div
                key={city}
                style={{
                  fontSize: "18px",
                  padding: "8px 16px",
                  background: "rgba(191, 160, 85, 0.18)",
                  border: "1px solid rgba(191, 160, 85, 0.4)",
                  borderRadius: "999px",
                  color: "#e8c478",
                }}
              >
                {city}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
