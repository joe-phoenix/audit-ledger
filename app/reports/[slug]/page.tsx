import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES, getReport, reports } from "@/lib/data";
import { ghs, full, pct } from "@/lib/format";
import { categoryColor } from "@/components/colors";
import { RankedBars, StackedYears, YearBars } from "@/components/Charts";
import { ChartCard, DataTable, PageHead, Section, Stat } from "@/components/ui";

export const dynamicParams = false;
export function generateStaticParams() {
  return reports.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const r = getReport((await params).slug);
  return r ? { title: `${r.shortTitle} ${r.year}`, description: `${ghs(r.total)} in irregularities. ${r.title}, ${r.period}.` } : {};
}

export default async function ReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const r = getReport((await params).slug);
  if (!r) notFound();

  const { years, totals } = r.trend;
  const hasTrend = years.length > 1;
  const prev = totals[totals.length - 2];
  const change = hasTrend ? (r.total / prev - 1) * 100 : 0;
  const cats = CATEGORIES.filter((c) => r.categories[c]).map((c) => ({ name: c, total: r.categories[c], color: categoryColor(c) }));
  const top = cats[0] && [...cats].sort((a, b) => b.total - a.total)[0];
  const trendCats = CATEGORIES.filter((c) => r.trend.categories[c]?.some(Boolean));
  const stacked = years.map((y, i) => ({ year: y, ...Object.fromEntries(trendCats.map((c) => [c, r.trend.categories[c][i]])) }));
  const breakdown = [...r.breakdown.items].sort((a, b) => b.total - a.total);
  const isRegion = r.breakdown.kind === "region";

  return (
    <>
      <PageHead eyebrow={`Auditor-General — ${r.period}`} title={r.shortTitle}
        badge={<span className="badge good">Verified from PDF</span>} desc={r.title}>
        <div className="source-strip">
          <span>Source: <a href={r.sourceUrl} target="_blank" rel="noopener">Ghana Audit Service, full report (PDF)</a></span>
          <span>Publisher: Ghana Audit Service</span>
        </div>
      </PageHead>

      <Section id="headline" title="The headline number">
        <div className="grid cols-3">
          <Stat label={`${r.year} total irregularities`} value={ghs(r.total)} tone="bad" delta={full(r.total)} />
          {hasTrend && <Stat label="Change on previous year" value={pct(change)} tone={change > 0 ? "bad" : "good"}
            delta={`From ${ghs(prev)} in ${years[years.length - 2]}`} />}
          {top && <Stat label={`Largest type: ${top.name}`} value={`${((top.total / r.total) * 100).toFixed(1)}%`} delta={`${ghs(top.total)} of the total`} />}
          {r.institutionsAudited && <Stat label="Institutions audited" value={r.institutionsAudited.toLocaleString()}
            delta={r.institutionsAuditedPrior ? `Up from ${r.institutionsAuditedPrior} the year before` : undefined} />}
          {r.recoverable && <Stat label="Recoverable" value={ghs(r.recoverable)} delta={`Administrative (not recoverable): ${ghs(r.administrative!)}`} />}
        </div>
      </Section>

      {hasTrend && <Section id="trend" title={`${years.length}-year trend`} sub={`Total irregularities, ${years[0]}–${years.at(-1)} · ${r.trend.source}`}>
        <ChartCard>
          <YearBars years={years} totals={totals} />
          <DataTable head={["Year", "Total"]} rows={years.map((y, i) => [y, full(totals[i])])} />
        </ChartCard>
      </Section>}

      <Section id="categories" title="By type of irregularity" sub={`${r.year}`}>
        <ChartCard>
          <RankedBars items={cats} />
          <DataTable head={["Type", "Amount", "Share"]} rows={[...cats].sort((a, b) => b.total - a.total).map((c) => [c.name, full(c.total), `${((c.total / r.total) * 100).toFixed(2)}%`])} />
        </ChartCard>
      </Section>

      <Section id="breakdown" title={r.breakdown.label} sub={r.breakdown.source}>
        <ChartCard foot={isRegion ? "Each region's total is summed across all audited institutions in that region." : undefined}>
          <RankedBars items={breakdown} color={isRegion ? "var(--s3)" : "var(--s1)"} />
          <DataTable head={[isRegion ? "Region" : "Institution", "Total"]} rows={breakdown.map((b) => [b.name, full(b.total)])} />
        </ChartCard>
      </Section>

      {hasTrend && <Section id="history" title="Type history" sub={`How the mix changed, ${years[0]}–${years.at(-1)}`}>
        <ChartCard>
          <StackedYears data={stacked} series={trendCats.map((c) => ({ key: c, label: c, color: categoryColor(c) }))} />
          <DataTable head={["Type", ...years.map(String)]}
            rows={[...trendCats.map((c) => [c, ...r.trend.categories[c].map((v) => v.toLocaleString("en-GH"))]), ["Total", ...totals.map((v) => v.toLocaleString("en-GH"))]]} />
        </ChartCard>
      </Section>}

      <Section id="findings" title="Notable findings" sub="Examples from the report">
        <div className="card">
          <ul className="highlight-list">
            {r.highlights.map((h) => <li key={h.text}><span>{h.text}</span><span className="amt">{h.amount}</span></li>)}
          </ul>
        </div>
      </Section>

      {!hasTrend && <div className="callout" style={{ marginBottom: 36 }}>No multi-year comparison: {r.trend.source}</div>}

      <Section title="Notes">
        <ul className="footnote">{r.notes.map((n) => <li key={n}>{n}</li>)}</ul>
      </Section>
    </>
  );
}
