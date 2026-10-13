import { reports } from "@/lib/data";
import { PageHead, Section } from "@/components/ui";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/about/", "About the data and methodology",
  "Where The Audit Ledger's figures come from: Ghana Audit Service reports, how each table was transcribed and checked, and the known quirks in the sources.");

export default function About() {
  return (
    <>
      <PageHead eyebrow="Methodology" title="About the data" />
      <Section title="Where the numbers come from">
        <div className="card footnote" style={{ maxWidth: "none" }}>
          <p>Every annual report figure is copied from the official PDF published by the Ghana Audit Service at audit.gov.gh. Each chart names the table or appendix it comes from. Totals are checked against the report&apos;s own breakdowns (by type, by ministry and by region) and any mismatch in the source is noted on the report page.</p>
          <p>Foreign-currency amounts are converted at the exchange rates the report itself uses. Anything not yet transcribed is left out or marked &quot;coming soon&quot;, never estimated.</p>
          <p>Recovery figures come from public statements by the Auditor-General as reported in the press and are labelled as secondary sources.</p>
        </div>
      </Section>
      <Section title="Reports included">
        <div className="card">
          {reports.map((r) => (
            <div className="field-row" key={r.slug}><span className="k">{r.title} — {r.period}</span><a href={r.sourceUrl} target="_blank" rel="noopener">PDF</a></div>
          ))}
        </div>
      </Section>
      <Section title="Adding a report">
        <div className="card footnote" style={{ maxWidth: "none" }}>
          Add a JSON file to <code>data/reports/</code> following an existing one, then list it in <code>lib/data.ts</code>. The report page, navigation and every overview chart update automatically.
        </div>
      </Section>
    </>
  );
}
