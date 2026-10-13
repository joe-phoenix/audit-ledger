import Link from "next/link";
import { allReports, reportYears, seriesLabel } from "@/lib/data";
import { ghs } from "@/lib/format";
import { seriesColor } from "@/components/colors";
import { PageHead, Section } from "@/components/ui";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/reports/", `All Ghana Auditor-General reports, ${Math.min(...reportYears)}–${Math.max(...reportYears)}`,
  `Every Auditor-General annual report on Ghana's public accounts from ${Math.min(...reportYears)} to ${Math.max(...reportYears)}, one page each: ministries, public boards and SOEs, district assemblies, universities and pre-university schools.`);

export default function Reports() {
  return (
    <>
      <PageHead eyebrow="Auditor-General" title="All reports" desc="One page per published annual report, each built from the official PDF." />
      {reportYears.map((y) => {
        const list = allReports.filter((r) => r.year === y).sort((a, b) => b.total - a.total);
        return (
          <Section key={y} title={`${y} financial year`} sub={`${ghs(list.reduce((s, r) => s + r.total, 0))} across ${list.length} reports`}>
            <div className="grid cols-2">
              {list.map((r) => (
                <Link key={r.slug} href={`/reports/${r.slug}/`} className="card report-card" style={{ borderLeftColor: seriesColor(r.series) }}>
                  <span className="tag">{r.period}</span>
                  <h3>{seriesLabel[r.series]}</h3>
                  <p>{r.title}</p>
                  <div className="figure">{ghs(r.total)}</div>
                </Link>
              ))}
            </div>
          </Section>
        );
      })}
    </>
  );
}
