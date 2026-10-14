import Link from "next/link";
import { allReports, reportYears, seriesLabel, type Report } from "@/lib/data";
import { full, ghs } from "@/lib/format";
import { categoryColor } from "@/components/colors";
import { StackedYears, YearBars } from "@/components/Charts";
import { ChartCard, DataTable, PageHead, Section, Stat } from "@/components/ui";
import { pageMeta } from "@/lib/seo";
import themes from "@/data/themes.json";

export const metadata = pageMeta("/themes/", "Recurring themes in Ghana's audit irregularities",
  "The problems that come back year after year in Ghana's Auditor-General reports: energy-sector debts, uncollected tax, abandoned projects, payments without paperwork, payroll leaks and unpaid fees.");

const years = [...reportYears].sort((a, b) => a - b);
const span = `${years[0]}–${years.at(-1)}`;
const inYear = (y: number) => allReports.filter((r) => r.year === y);
const sum = (rs: Report[], f: (r: Report) => number) => rs.reduce((s, r) => s + f(r), 0);
const cat = (r: Report, c: string) => (r.categories as Record<string, number>)[c] ?? 0;

/** One institution's total in each year of a series, from that year's own report. */
function institutionByYear(series: string, name: string) {
  return allReports.filter((r) => r.series === series && r.breakdown.kind === "institution")
    .sort((a, b) => a.year - b.year)
    .map((r) => ({ year: r.year, total: r.breakdown.items.find((i) => i.name === name)?.total ?? 0, slug: r.slug }));
}

/** Report highlights whose text matches a theme, newest first. */
function highlightsMatching(re: RegExp, limit = 8, exclude?: RegExp) {
  return allReports
    .flatMap((r) => r.highlights
      // Skip summary lines (a percentage or no amount) and anything the exclude pattern rules out.
      .filter((h) => re.test(h.text) && !/%|^—$/.test(h.amount) && !(exclude && exclude.test(h.text)))
      .map((h) => ({ ...h, r })))
    .sort((a, b) => b.r.year - a.r.year)
    .slice(0, limit);
}

function Findings({ items }: { items: ReturnType<typeof highlightsMatching> }) {
  return (
    <ul className="highlight-list">
      {items.map((h) => (
        <li key={`${h.r.slug}-${h.text}`}>
          <span>
            {h.text}{" "}
            <Link className="theme-src" href={`/reports/${h.r.slug}/`}>{seriesLabel[h.r.series]} {h.r.year}</Link>
          </span>
          <span className="amt">{h.amount}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Themes() {
  const latest = years.at(-1)!;

  // 1. Debts and loans vs everything else
  const debtRows = years.map((y) => {
    const rs = inYear(y), debts = sum(rs, (r) => cat(r, "Debts/Loans"));
    return { year: y, debts, other: sum(rs, (r) => r.total) - debts };
  });
  const debtShares = debtRows.map((d) => (d.debts / (d.debts + d.other)) * 100);
  const energy = institutionByYear("public-boards", "Ministry of Energy");

  // 2. Tax at the Ministry of Finance (incl. GRA)
  const finance = institutionByYear("mda", "Ministry of Finance (incl. GRA)");
  const mda = allReports.filter((r) => r.series === "mda");
  const mdaTaxShare = (sum(mda, (r) => cat(r, "Tax")) / sum(mda, (r) => r.total)) * 100;

  // 3. Revenue collectors
  const rc = themes.revenueCollectors.points;
  const lastRc = rc.at(-1)!;

  // 4. Projects
  const ap = themes.abandonedProjects.points, up = themes.unusedProjects.points;
  const projectsTotal = ap.reduce((s, p) => s + p.amount, 0) + up.reduce((s, p) => s + p.amount, 0);

  // 6. Payroll
  const payroll = years.map((y) => sum(inYear(y), (r) => cat(r, "Payroll")));
  const payrollMaxShare = Math.max(...years.map((y, i) => (payroll[i] / sum(inYear(y), (r) => r.total)) * 100));

  // 8. Cash
  const cash = years.map((y) => sum(inYear(y), (r) => cat(r, "Cash")));
  const cashShare = (y: number) => (cash[years.indexOf(y)] / sum(inYear(y), (r) => r.total)) * 100;

  return (
    <>
      <PageHead eyebrow="Analysis" title="Recurring themes"
        desc={`Read ${allReports.length} Auditor-General reports from ${span} side by side and the same problems keep coming back. These are the patterns, largest first.`}>
        <div className="callout" style={{ marginTop: 16 }}>
          &ldquo;Irregularity&rdquo; is the Auditor-General&apos;s term. It covers money owed, tax not collected and missing paperwork as well as actual losses, so these totals are not a measure of theft. Themes 3–7 draw partly on report highlights, which show what recurs rather than every finding.
        </div>
      </PageHead>

      <Section id="debts" title="1. Most of it is money owed, not money stolen"
        sub={`Debts and loans are the largest category every year: ${Math.min(...debtShares).toFixed(0)}–${Math.max(...debtShares).toFixed(0)}% of all irregularities.`}>
        <div className="grid pair">
          <ChartCard title="Debts and loans vs everything else" sub="All reports, each year's own figures">
            <StackedYears data={debtRows} series={[
              { key: "debts", label: "Debts/Loans", color: categoryColor("Debts/Loans") },
              { key: "other", label: "Everything else", color: "var(--line-strong)" },
            ]} />
            <DataTable head={["Year", "Debts/Loans", "Everything else", "Debts share"]}
              rows={debtRows.map((d, i) => [d.year, full(d.debts), full(d.other), `${debtShares[i].toFixed(1)}%`])} />
          </ChartCard>
          <ChartCard title="Ministry of Energy bodies" sub="Public Boards & SOEs report, by year"
            foot="Mostly unpaid power and gas bills between state bodies: VRA, NEDCo, Ghana Gas, Bui Power and ECG.">
            <YearBars years={energy.map((e) => e.year)} totals={energy.map((e) => e.total)} height={240} />
          </ChartCard>
        </div>
      </Section>

      <Section id="tax" title="2. Tax that was never collected"
        sub={`${mdaTaxShare.toFixed(0)}% of irregularities in the ministries reports are tax, almost all at the Ghana Revenue Authority.`}>
        <div className="grid pair">
          <ChartCard title="Ministry of Finance (incl. GRA)" sub="Ministries report, by year">
            <YearBars years={finance.map((e) => e.year)} totals={finance.map((e) => e.total)} height={240} />
          </ChartCard>
          <div className="card"><Findings items={highlightsMatching(/VAT|unpaid tax|tax(es)? (owed|debt|irregularit)|owed .*tax|rescheduled tax/i, 6)} /></div>
        </div>
      </Section>

      <Section id="collectors" title="3. Councils paying more to collect revenue than they bring in"
        sub={`In ${lastRc.year}, ${lastRc.collectors} revenue collectors were paid ${ghs(lastRc.salaries)} and collected ${ghs(lastRc.collected)}.`}>
        <div className="grid pair">
          <ChartCard title="Collectors' salaries vs revenue they collected" sub="District assemblies' own revenue (IGF) reports"
            foot="The full bar is what the collectors were paid; the grey part is the shortfall.">
            <StackedYears data={rc.map((p) => ({ year: p.year, collected: p.collected, shortfall: p.salaries - p.collected }))} series={[
              { key: "collected", label: "Revenue collected", color: "var(--s3)" },
              { key: "shortfall", label: "Shortfall", color: "var(--line-strong)" },
            ]} height={260} />
            <DataTable head={["Year", "Collectors", "Salaries", "Collected", "Shortfall"]}
              rows={rc.map((p) => [p.year, p.collectors, full(p.salaries), full(p.collected), full(p.salaries - p.collected)])} />
          </ChartCard>
          <div className="card"><Findings items={highlightsMatching(/not collected|revenue collected but not|rent (not|owed)/i, 6)} /></div>
        </div>
      </Section>

      <Section id="projects" title="4. Projects abandoned, or finished and never used"
        sub={`The largest Common Fund finding every year. Abandoned and unused projects add up to ${ghs(projectsTotal)} over ${ap.length} years.`}>
        <div className="grid pair">
          <ChartCard title="Delayed or abandoned projects" sub="District Assemblies Common Fund reports">
            <YearBars years={ap.map((p) => p.year)} totals={ap.map((p) => p.amount)} height={240} />
            <DataTable head={["Year", "Delayed/abandoned", "Completed, not used"]}
              rows={ap.map((p, i) => [p.year, `${full(p.amount)} (${p.detail})`, `${full(up[i].amount)} (${up[i].detail})`])} />
          </ChartCard>
          <div className="grid" style={{ alignContent: "start" }}>
            {themes.deductedAtSource.points.map((p) => (
              <Stat key={p.year} label={`Common Fund deducted at source, ${p.year}`} value={ghs(p.amount)} tone="bad"
                delta={`${((p.amount / p.of) * 100).toFixed(0)}% of ${ghs(p.of)}, before it reached assemblies: ${p.detail}.`}
                href={`/reports/${p.report}/`} />
            ))}
          </div>
        </div>
      </Section>

      <Section id="paperwork" title="5. Payments without paperwork"
        sub="Unsupported payments, missing vouchers and spending outside the government's financial system (GIFMIS) appear in almost every series.">
        <div className="card"><Findings items={highlightsMatching(/unsupported|unsubstantiated|voucher|without .*document|no .*document|GIFMIS|not accounted for|no evidence/i, 10, /payroll/i)} /></div>
      </Section>

      <Section id="payroll" title="6. Payroll leaks: small in money, constant in time"
        sub={`Payroll never exceeds ${payrollMaxShare.toFixed(1)}% of the total, but it turns up every year.`}>
        <div className="grid pair">
          <ChartCard title="Payroll irregularities" sub="All reports, by year">
            <YearBars years={years} totals={payroll} height={240} />
          </ChartCard>
          <div className="card"><Findings items={highlightsMatching(/unearned salar|payroll|never employ|bond default/i, 7)} /></div>
        </div>
      </Section>

      <Section id="fees" title="7. Unpaid fees in education"
        sub="Students and past students owing fees is the most common item in the universities, colleges and schools reports.">
        <div className="card"><Findings items={highlightsMatching(/fees (owed|by students)|student fees|owed by students|textbooks|owed to schools/i, 8)} /></div>
      </Section>

      <Section id="cash" title={`8. Cash irregularities jumped in ${latest}`}
        sub={`Cash was ${cashShare(latest).toFixed(0)}% of all irregularities in ${latest}, against ${cashShare(latest - 1).toFixed(0)}% in ${latest - 1}.`}>
        <div className="grid pair">
          <ChartCard title="Cash irregularities" sub="All reports, by year">
            <YearBars years={years} totals={cash} height={240} />
          </ChartCard>
          <div className="card"><Findings items={highlightsMatching(/ECG|cash (irregular|transaction)/i, 5)} /></div>
        </div>
      </Section>
    </>
  );
}
