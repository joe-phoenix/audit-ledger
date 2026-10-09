import { reports, seriesLabel } from "@/lib/data";
import { ghs, full } from "@/lib/format";
import { seriesColor } from "@/components/colors";
import { RankedBars, StackedRanked } from "@/components/Charts";
import { ChartCard, DataTable, PageHead, Section } from "@/components/ui";

export const metadata = { title: "By region" };

export default function Regions() {
  const regional = reports.filter((r) => r.breakdown.kind === "region");
  const names = Array.from(new Set(regional.flatMap((r) => r.breakdown.items.map((i) => i.name))));
  const rows = names.map((n) => ({
    name: n,
    ...Object.fromEntries(regional.map((r) => [r.series, r.breakdown.items.find((i) => i.name === n)?.total ?? 0])),
  })) as ({ name: string } & Record<string, number>)[];
  const combined = rows.map((r) => ({ name: r.name, total: regional.reduce((s, x) => s + r[x.series], 0) })).sort((a, b) => b.total - a.total);
  const series = regional.map((r) => ({ key: r.series, label: seriesLabel[r.series], color: seriesColor(r.series) }));

  return (
    <>
      <PageHead eyebrow="Explore" title="By region"
        desc="District assemblies and schools are reported region by region across Ghana's 16 regions. Ministries and public boards are national and are not broken down by region." />

      <Section title="Combined, 2023" sub="District assemblies (Common Fund and own revenue), colleges of education and pre-university schools">
        <ChartCard foot={`${combined[0].name} and ${combined[1].name} lead, Greater Accra is high mainly because of GH¢11.7m in uncollected assembly revenue.`}>
          <StackedRanked data={combined.map((c) => rows.find((x) => x.name === c.name)!)} series={series} />
          <DataTable head={["Region", ...series.map((s) => s.label), "Total"]}
            rows={combined.map((c) => { const r = rows.find((x) => x.name === c.name)!; return [c.name, ...series.map((s) => full(r[s.key])), full(c.total)]; })} />
        </ChartCard>
      </Section>

      <div className="grid cols-2">
        {regional.map((r) => (
          <ChartCard key={r.slug} title={seriesLabel[r.series]} sub={`${ghs(r.total)} total · ${r.breakdown.source}`}>
            <RankedBars items={r.breakdown.items} color={seriesColor(r.series)} />
          </ChartCard>
        ))}
      </div>
    </>
  );
}
