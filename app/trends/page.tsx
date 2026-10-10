import { seriesSummaries, seriesLabel } from "@/lib/data";
import { ghs, full } from "@/lib/format";
import { seriesColor } from "@/components/colors";
import { YearBars } from "@/components/Charts";
import { TrendExplorer } from "@/components/TrendExplorer";
import { ChartCard, DataTable, PageHead, Section } from "@/components/ui";

export const metadata = { title: "Trends over years" };

export default function Trends() {
  const reports = seriesSummaries();
  const series = reports.map((r) => ({ key: r.series, label: seriesLabel[r.series], color: seriesColor(r.series), years: r.trend.years, totals: r.trend.totals }));
  const years = Array.from(new Set(reports.flatMap((r) => r.trend.years))).sort();
  return (
    <>
      <PageHead eyebrow="Explore" title="Trends over years"
        desc="Is it getting better? Each report's own five-year comparison table, side by side." />

      <Section title="Relative change" sub="Each report indexed to 2021 = 100, so reports of very different size can share one scale">
        <ChartCard foot="Above 100 means more irregularities than in 2021. Click a report to hide or show it.">
          <TrendExplorer series={series} />
        </ChartCard>
      </Section>

      <Section title="Each report in cedis" sub="Small multiples, each on its own scale">
        <div className="grid cols-2">
          {reports.map((r) => {
            const first = r.trend.totals[0], last = r.trend.totals.at(-1)!;
            return (
              <ChartCard key={r.slug} title={seriesLabel[r.series]}
                sub={`${ghs(first)} in ${r.trend.years[0]} → ${ghs(last)} in ${r.year} (${((last / first - 1) * 100).toFixed(0)}%)`}>
                <YearBars years={r.trend.years} totals={r.trend.totals} height={220} />
              </ChartCard>
            );
          })}
        </div>
      </Section>

      <DataTable summary="Show all figures" head={["Report", ...years.map(String)]}
        rows={reports.map((r) => [seriesLabel[r.series], ...years.map((y) => { const i = r.trend.years.indexOf(y); return i === -1 ? "—" : full(r.trend.totals[i]); })])} />
    </>
  );
}
