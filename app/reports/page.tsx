import Link from "next/link";
import { reports } from "@/lib/data";
import { ghs } from "@/lib/format";
import { seriesColor } from "@/components/colors";
import { PageHead } from "@/components/ui";

export const metadata = { title: "All reports" };

export default function Reports() {
  return (
    <>
      <PageHead eyebrow="Auditor-General" title="All reports" desc="One page per published report, each built from the official PDF." />
      <div className="grid cols-2">
        {reports.map((r) => (
          <Link key={r.slug} href={`/reports/${r.slug}/`} className="card report-card" style={{ borderLeftColor: seriesColor(r.series) }}>
            <span className="tag">{r.period}</span>
            <h3>{r.shortTitle}</h3>
            <p>{r.title}</p>
            <div className="figure">{ghs(r.total)}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
