import { overview } from "@/lib/data";
import { full, ghs } from "@/lib/format";
import { categoryColor } from "@/components/colors";
import { RankedBars, StackedYears } from "@/components/Charts";
import { ChartCard, DataTable, PageHead, Section, Stat } from "@/components/ui";

export const metadata = { title: "Recoveries" };

export default function Recoveries() {
  const r = overview.recoveries;
  const acct = r.recoveriesAccount;
  const share = (r.recovered / r.flagged) * 100;
  const { years, recoverable, recovered } = r.byYear;
  const cats = Object.keys(r.byType.categories);
  const typeRows = r.byType.years.map((y, i) => ({
    year: y,
    ...Object.fromEntries(cats.map((c) => [c, r.byType.categories[c as keyof typeof r.byType.categories][i]])),
  }));
  const outside = r.byRegion.items.filter((i) => i.name !== "Greater Accra");
  const p = r.payroll;

  return (
    <>
      <PageHead eyebrow="Follow-up" title="What was recovered"
        badge={<span className="badge good">Official report</span>}
        desc="Finding irregularities is half the job. In February 2025 the Auditor-General reported to Parliament how much of the money flagged in the 2020–2023 reports has actually come back.">
        <div className="source-strip">
          <span>Source: <a href={r.source.url} target="_blank" rel="noopener">Special audit report on recoveries, 2020–2023 (PDF)</a></span>
          <span>Publisher: Ghana Audit Service</span>
        </div>
      </PageHead>

      <Section title="Flagged vs recovered" sub="Audit reports for 2020–2023">
        <div className="grid cols-3">
          <Stat label="Flagged for recovery" value={ghs(r.flagged)} delta={full(r.flagged)} />
          <Stat label="Recovered" value={ghs(r.recovered)} tone="good" delta={full(r.recovered)} />
          <Stat label="Recovery rate" value={`${share.toFixed(1)}%`} tone="bad" delta={`${ghs(r.flagged - r.recovered)} still outstanding`} />
        </div>
        <div className="card" style={{ marginTop: 16 }}>
          <div className="chart-title">Share recovered</div>
          <div className="bar-row" style={{ marginTop: 10 }}>
            <div className="bar-track" aria-hidden="true">
              <div className="bar-fill" style={{ width: `${share}%`, background: "var(--s3)" }} />
            </div>
            <span className="bar-out">{share.toFixed(1)}% recovered</span>
          </div>
        </div>
      </Section>

      <Section title="By year of the audit report" sub={r.byYear.source}>
        <ChartCard foot="Older reports have had more time to collect: 60% of 2020's flagged amount has come back, against 13% of 2023's.">
          <StackedYears
            data={years.map((y, i) => ({ year: y, recovered: recovered[i], outstanding: recoverable[i] - recovered[i] }))}
            series={[{ key: "recovered", label: "Recovered", color: "var(--s3)" }, { key: "outstanding", label: "Still outstanding", color: "var(--line-strong)" }]} />
          <DataTable head={["Report year", "Flagged", "Recovered", "Rate"]}
            rows={years.map((y, i) => [y, full(recoverable[i]), full(recovered[i]), `${((recovered[i] / recoverable[i]) * 100).toFixed(1)}%`])} />
        </ChartCard>
      </Section>

      <Section title="By type of irregularity" sub={r.byType.source}>
        <ChartCard foot="Debts and loans make up 78% of everything recovered.">
          <StackedYears data={typeRows} series={cats.map((c) => ({ key: c, label: c, color: categoryColor(c) }))} />
          <DataTable head={["Type", ...r.byType.years.map(String)]}
            rows={cats.map((c) => [c, ...r.byType.categories[c as keyof typeof r.byType.categories].map((v) => full(v))])} />
        </ChartCard>
      </Section>

      <div className="grid cols-2">
        <ChartCard title="By report" sub={r.byReport.source}>
          <RankedBars items={r.byReport.items} color="var(--s3)" />
        </ChartCard>
        <ChartCard title="By region, outside Greater Accra" sub={`${r.byRegion.source}. Greater Accra alone: ${ghs(r.byRegion.items.find((i) => i.name === "Greater Accra")!.total)} (98%).`}>
          <RankedBars items={outside} color="var(--s3)" />
        </ChartCard>
      </div>

      <Section title="Payroll savings and recoveries" sub={`${p.source}, ${p.years[0]}–${p.years.at(-1)}`}>
        <ChartCard foot={`Savings are salary claims the Auditor-General refused to certify, about ${ghs(p.savings.reduce((a, b) => a + b, 0))} in total. Recoveries are unearned salaries paid back.`}>
          <StackedYears data={p.years.map((y, i) => ({ year: y, savings: p.savings[i], recoveries: p.recoveries[i] }))}
            series={[{ key: "savings", label: "Payroll savings", color: "var(--s1)" }, { key: "recoveries", label: "Unearned salaries recovered", color: "var(--s3)" }]} height={260} />
        </ChartCard>
      </Section>

      <Section title="Auditor-General Recoveries Account" sub="Bank of Ghana account opened June 2022">
        <div className="grid cols-2">
          <Stat label="Recovered since June 2022" value={ghs(acct.cumulativeRecovered)} tone="good" delta="Transferred to the Consolidated Fund" />
          <Stat label="Surcharges still unpaid" value={ghs(acct.outstandingSurcharges)} tone="bad" delta="Amounts individuals were ordered to repay" />
        </div>
        <p className="chart-foot"><span className="badge warn">Secondary source</span> {acct.note} Source: <a href={acct.source.url} target="_blank" rel="noopener">{acct.source.label}</a></p>
      </Section>

      <Section title="Notes">
        <ul className="footnote">{r.notes.map((n) => <li key={n}>{n}</li>)}</ul>
      </Section>
    </>
  );
}
