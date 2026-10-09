import { overview } from "@/lib/data";
import { ghs } from "@/lib/format";
import { RankedBars } from "@/components/Charts";
import { ChartCard, DataTable, PageHead, Section, Stat } from "@/components/ui";

export const metadata = { title: "Recoveries" };

export default function Recoveries() {
  const d = overview.recoveries.disallowances2020to2023;
  const acct = overview.recoveries.recoveriesAccount;
  const share = (d.recovered / d.flagged) * 100;
  return (
    <>
      <PageHead eyebrow="Follow-up" title="What was recovered"
        badge={<span className="badge warn">Secondary sources</span>}
        desc="Finding irregularities is half the job. These figures track how much flagged money has actually come back. They come from news reports of Auditor-General statements, not from the annual reports, so treat them as indicative." />

      <Section title="Disallowed vs recovered" sub="Audits of 2020–2023">
        <div className="grid cols-3">
          <Stat label="Flagged for recovery" value={ghs(d.flagged)} />
          <Stat label="Recovered" value={ghs(d.recovered)} tone="good" />
          <Stat label="Recovery rate" value={`${share.toFixed(1)}%`} delta={`${ghs(d.flagged - d.recovered)} still outstanding`} tone="bad" />
        </div>
        <div className="card" style={{ marginTop: 16 }}>
          <div className="chart-title">Share recovered</div>
          <div className="bar-track" style={{ marginTop: 10 }} role="img" aria-label={`${share.toFixed(1)}% recovered`}>
            <div className="bar-fill" style={{ width: `${share}%`, background: "var(--s3)" }}><span>{share.toFixed(1)}% recovered</span></div>
          </div>
          <p className="chart-foot">Source: <a href={d.source.url} target="_blank" rel="noopener">{d.source.label}</a></p>
        </div>
      </Section>

      <Section title="Recovered by sector" sub="2020–2023 audits">
        <ChartCard foot={d.regionNote}>
          <RankedBars items={d.bySector} color="var(--s3)" />
          <DataTable head={["Sector", "Recovered"]} rows={d.bySector.map((s) => [s.name, ghs(s.total)])} />
        </ChartCard>
      </Section>

      <Section title="Auditor-General Recoveries Account" sub="Bank of Ghana account opened June 2022">
        <div className="grid cols-2">
          <Stat label="Recovered since June 2022" value={ghs(acct.cumulativeRecovered)} tone="good" delta="Transferred to the Consolidated Fund" />
          <Stat label="Surcharges still unpaid" value={ghs(acct.outstandingSurcharges)} tone="bad" delta="Amounts individuals were ordered to repay" />
        </div>
        <p className="chart-foot">{acct.note} Source: <a href={acct.source.url} target="_blank" rel="noopener">{acct.source.label}</a></p>
      </Section>
    </>
  );
}
