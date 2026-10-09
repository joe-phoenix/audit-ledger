import Link from "next/link";
import { combinedCategories, overview, reports, seriesLabel, seriesTrend } from "@/lib/data";
import { ghs, full } from "@/lib/format";
import { categoryColor, seriesColor } from "@/components/colors";
import { RankedBars, StackedYears } from "@/components/Charts";
import { ChartCard, DataTable, PageHead, Section, Stat } from "@/components/ui";

export default function Home() {
  const covered = reports.reduce((s, r) => s + r.total, 0);
  const [c22, c23] = overview.consolidated.totals;
  const trend = seriesTrend();
  const series = reports.map((r) => ({ key: r.series, label: seriesLabel[r.series], color: seriesColor(r.series) }));
  const cats = combinedCategories(2023).map((c) => ({ ...c, color: categoryColor(c.name) }));
  const pb = reports.find((r) => r.series === "public-boards")!;

  return (
    <>
      <PageHead eyebrow="Accountability & governance — Ghana" title="Public money, made legible"
        desc="Every year the Auditor-General reports how public institutions handled money, and where it went wrong. These reports run to hundreds of pages. The Audit Ledger turns them into charts you can read in minutes." />

      <Section id="headline" title="The headline numbers" sub="2023 financial year">
        <div className="grid cols-3">
          <Stat label="All Auditor-General reports, 2023" value={ghs(c23)} tone="bad"
            delta={<>Down from {ghs(c22)} in 2022 ({((c23 / c22 - 1) * 100).toFixed(0)}%), across six reports</>} />
          <Stat label="Sum of all reports on this site" value={ghs(covered)}
            delta="All six 2023 reports. The 0.1% gap to the official total comes from rounding and a mismatch inside the district assemblies report." />
          <Stat label="Owed to the Bank of Ghana by COCOBOD" value="GH¢8.24bn"
            delta={`${((8241883644 / c23) * 100).toFixed(0)}% of all irregularities come from this single debt`} />
        </div>
      </Section>

      <Section title="Where the irregularities were found" sub="Total per report, 2023">
        <ChartCard foot="The bar lengths differ by more than 1,000×: public boards dominate because of large outstanding debts and loans.">
          <RankedBars items={reports.map((r) => ({ name: seriesLabel[r.series], total: r.total, color: seriesColor(r.series) }))} />
          <DataTable head={["Report", "2023 total"]} rows={reports.map((r) => [r.shortTitle, full(r.total)])} />
        </ChartCard>
        <div className="grid cols-2" style={{ marginTop: 16 }}>
          {reports.map((r) => (
            <Link key={r.slug} href={`/reports/${r.slug}/`} className="card report-card" style={{ borderLeftColor: seriesColor(r.series) }}>
              <span className="tag">Auditor-General — {r.year}</span>
              <h3>{r.shortTitle}</h3>
              <p>{r.institutionsAudited ? `${r.institutionsAudited.toLocaleString()} institutions audited. ` : ""}{r.breakdown.label}, by type and five-year trend.</p>
              <div className="figure">{ghs(r.total)}</div>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Five-year trend" sub="Total irregularities per report, 2019–2023 (some reports only give 2021 onwards; colleges of education only 2023)"
        right={<Link href="/trends/" className="subhead">Explore trends →</Link>}>
        <ChartCard foot="Hover a bar for each report's figure. Public boards peaked at GH¢17.5bn in 2021.">
          <StackedYears data={trend} series={series} />
        </ChartCard>
      </Section>

      <Section title="What kind of irregularities" sub="All reports combined, 2023"
        right={<Link href="/categories/" className="subhead">By type →</Link>}>
        <ChartCard foot={`Debts and loans are ${ghs(pb.categories["Debts/Loans"])}, almost all in the public boards report.`}>
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
