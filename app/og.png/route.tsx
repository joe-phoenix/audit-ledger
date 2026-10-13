import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { LATEST_YEAR, allReports } from "@/lib/data";
import { ghs } from "@/lib/format";

export const dynamic = "force-static";
const size = { width: 1200, height: 630 };

const font = (f: string) => readFile(join(process.cwd(), "assets/fonts", f));

/**
 * Social share card, built at deploy time so the headline figure tracks the data.
 * A route named og.png (not opengraph-image.tsx) so the static export writes a real .png file.
 */
export async function GET() {
  const total = allReports.filter((r) => r.year === LATEST_YEAR).reduce((s, r) => s + r.total, 0);
  const bars = [1, 0.66, 0.38];

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#16213e", color: "#fff", padding: "72px 80px", fontFamily: "DM Sans" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: 14, background: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", gap: 7, padding: "0 13px", position: "relative" }}>
            {bars.map((w, i) => <div key={i} style={{ width: `${w * 100}%`, height: 7, borderRadius: 4, background: "#16213e", opacity: 1 - i * 0.25 }} />)}
            <div style={{ position: "absolute", right: 10, bottom: 10, width: 11, height: 11, borderRadius: 6, background: "#3457e8" }} />
          </div>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 700 }}>The Audit Ledger<span style={{ color: "#6c8cf5" }}>.</span></div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.1, letterSpacing: -1 }}>{"Ghana's Auditor-General reports, visualised"}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 22, marginTop: 34 }}>
            <div style={{ fontFamily: "JetBrains Mono", fontWeight: 700, fontSize: 60, color: "#f0958c" }}>{ghs(total)}</div>
            <div style={{ fontSize: 28, fontWeight: 500, color: "#c3cadb" }}>{`in irregularities across all ${LATEST_YEAR} reports`}</div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, fontWeight: 500, color: "#a8b0bd" }}>
          <div>auditledger.labaridata.com</div>
          <div style={{ display: "flex" }}>Powered by&nbsp;<span style={{ color: "#fff", fontWeight: 700 }}>Labari Data</span></div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "DM Sans", data: await font("DMSans-500.ttf"), weight: 500 },
        { name: "DM Sans", data: await font("DMSans-700.ttf"), weight: 700 },
        { name: "JetBrains Mono", data: await font("JetBrainsMono-700.ttf"), weight: 700 },
      ],
    },
  );
}
