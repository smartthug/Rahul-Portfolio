import { ImageResponse } from "next/og";

export const alt = "Rahul — Freelance web developer in Chennai. Business websites, landing pages and React web apps.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "edge";

// Static link-preview card in the site's neobrutalist style (system font only).
export default function OpengraphImage() {
  const ink = "#111111";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "#f5f1e8",
          borderBottom: `24px solid ${ink}`,
          color: ink,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              background: ink,
              color: "#f5f1e8",
              padding: "8px 16px",
              fontSize: 26,
              letterSpacing: 2,
            }}
          >
            FREELANCE WEB DEVELOPER // CHENNAI, INDIA
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", fontSize: 80, lineHeight: 1.08 }}>
          <span>WEBSITES THAT TURN</span>
          <span>VISITORS INTO</span>
          <span
            style={{
              display: "flex",
              marginTop: 10,
              background: "#ffd84d",
              border: `5px solid ${ink}`,
              boxShadow: `8px 8px 0 ${ink}`,
              padding: "0 16px",
            }}
          >
            ENQUIRIES.
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 30 }}>
          <span style={{ fontWeight: 800 }}>Rahul · Web Developer</span>
          <span>Business websites · Landing pages · React / Next.js</span>
        </div>
      </div>
    ),
    size
  );
}
