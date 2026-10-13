import Link from "next/link";
import { LATEST_YEAR, allReports, combinedCategories, reports, seriesLabel, seriesSummaries, seriesTrend } from "@/lib/data";
import { ghs, full } from "@/lib/format";
import { categoryColor, seriesColor } from "@/components/colors";
import { RankedBars, StackedYears } from "@/components/Charts";
import { ChartCard, DataTable, PageHead, Section, Stat } from "@/components/ui";

export default function Home() {
  const Y = LATEST_YEAR;
  const yearTotal = (y: number) => allReports.filter((r) => r.year === y).reduce((s, r) => s + r.total, 0);
  const cur = yearTotal(Y), prev = yearTotal(Y - 1);
  const trend = seriesTrend();
  const series = seriesSummaries().map((r) => ({ key: r.series, label: seriesLabel[r.series], color: seriesColor(r.series) }));
  const cats = combinedCategories(Y).map((c) => ({ ...c, color: categoryColor(c.name) }));
  const top = reports.flatMap((r) => r.breakdown.kind === "institution" ? r.breakdown.items.map((i) => ({ ...i, report: r })) : [])
    .sort((a, b) => b.total - a.total)[0];
  const debts = cats.find((c) => c.name === "Debts/Loans");

  return (
    <>
      <PageHead eyebrow="Accountability & governance — Ghana" title="Public money, made legible"
        desc="Every year the Auditor-General reports how public institutions handled money, and where it went wrong. These reports run to hundreds of pages. The Audit Ledger turns them into charts you can read in minutes.">
        <p className="powered-by">Powered by <strong>Labari Data</strong></p>
      </PageHead>

      <Section id="headline" title="The headline numbers" sub={`${Y} financial year`}>
        <div className="grid cols-3">
          <Stat label={`All Auditor-General reports, ${Y}`} value={ghs(cur)} tone="bad"
            delta={<>{cur > prev ? "Up" : "Down"} from {ghs(prev)} in {Y - 1} ({cur > prev ? "+" : ""}{((cur / prev - 1) * 100).toFixed(0)}%), sum of the {allReports.filter((r) => r.year === Y).length} annual reports</>} href="/reports/" />
          <Stat label={`Largest single area: ${top.name}`} value={ghs(top.total)}
            delta={`${((top.total / cur) * 100).toFixed(0)}% of all ${Y} irregularities, in the ${seriesLabel[top.report.series]} report`}
            href={`/reports/${top.report.slug}/`} />
          {debts && <Stat label="Debts and loans not collected" value={ghs(debts.total)}
            delta={`${((debts.total / cur) * 100).toFixed(0)}% of the total. Money owed to public bodies, mostly between state agencies.`}
            href="/categories/" />}
        </div>
      </Section>

      <Section title="Where the irregularities were found" sub={`Total per report, ${Y}`}>
        <ChartCard foot="The bar lengths differ by more than 1,000×: public boards dominate because of large outstanding debts and loans.">
          <RankedBars items={reports.map((r) => ({ name: seriesLabel[r.series], total: r.total, color: seriesColor(r.series) }))} />
          <DataTable head={["Report", `${Y} total`]} rows={reports.map((r) => [r.shortTitle, full(r.total)])} />
        </ChartCard>
        <div className="grid cols-2" style={{ marginTop: 16 }}>
          {reports.map((r) => (
            <Link key={r.slug} href={`/reports/${r.slug}/`} className="card report-card" style={{ borderLeftColor: seriesColor(r.series) }}>
              <span className="tag">Auditor-General — {r.year}</span>
              <h3>{r.shortTitle}</h3>
              <p>{r.institutionsAudited ? `${r.institutionsAudited.toLocaleString()} institutions audited. ` : ""}{r.breakdown.label}, by type and trend.</p>
              <div className="figure">{ghs(r.total)}</div>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Five-year trend" sub={`Total irregularities per report, ${trend[0].year}–${Y}. Some reports only give recent years.`}
        right={<Link href="/trends/" className="subhead">Explore trends →</Link>}>
        <ChartCard foot="Hover a bar for each report's figure. The universities report changed scope in 2024, so technical universities and colleges stop in 2023.">
          <StackedYears data={trend} series={series} />
        </ChartCard>
      </Section>

      <Section title="What kind of irregularities" sub={`All reports combined, ${Y}`}
        right={<Link href="/categories/" className="subhead">By type →</Link>}>
        <ChartCard>
          <RankedBars items={cats} />
        </ChartCard>
      </Section>

      <div className="callout">
        <strong>Recoveries:</strong> of GH¢39.0bn flagged for recovery in 2020–2023 audits, GH¢12.7bn (32.6%) has been recovered.{" "}
        <Link href="/recoveries/">See what came back →</Link>
      </div>
    </>
  );
}
