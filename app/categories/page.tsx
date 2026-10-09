import { CATEGORIES, combinedCategories, reports, seriesLabel } from "@/lib/data";
import { full } from "@/lib/format";
import { categoryColor, seriesColor } from "@/components/colors";
import { RankedBars } from "@/components/Charts";
import { CategoryExplorer } from "@/components/CategoryExplorer";
import { ChartCard, DataTable, PageHead, Section } from "@/components/ui";

export const metadata = { title: "By irregularity type" };

const DEFINITIONS: Record<string, string> = {
  "Debts/Loans": "Money owed to institutions that has not been collected: loans, staff and trade debtors, inter-agency debts.",
  Tax: "Taxes not collected, withheld or paid over to the Ghana Revenue Authority.",
  Contract: "Overpayments, payments for work not done, and delayed or abandoned projects.",
  Cash: "Payments without supporting documents, unaccounted revenue, misused funds.",
  "Procurement/Stores": "Goods paid for but not supplied, breaches of procurement law, unaccounted stores and fuel.",
  Payroll: "Salaries paid to people who had left, were never employed, or were overpaid.",
  Rent: "Rent owed to the state and not collected.",
  Sanitation: "Payments for sanitation or fumigation services not delivered.",
};

export default function Categories() {
  const years = Array.from(new Set(reports.flatMap((r) => r.trend.years))).sort();
  const present = CATEGORIES.filter((c) => reports.some((r) => r.trend.categories[c]?.some(Boolean)));
  const rowsByCategory = Object.fromEntries(present.map((c) => [c, years.map((y) => {
    const row: Record<string, number | null> = { year: y };
    for (const r of reports) { const i = r.trend.years.indexOf(y); row[r.series] = i === -1 ? null : (r.trend.categories[c]?.[i] ?? 0); }
    return row;
  })]));
  const series = reports.map((r) => ({ key: r.series, label: seriesLabel[r.series], color: seriesColor(r.series) }));
  const mix = combinedCategories(2023).map((c) => ({ ...c, color: categoryColor(c.name) }));
  const mixNoDebt = mix.filter((c) => c.name !== "Debts/Loans");

  return (
    <>
      <PageHead eyebrow="Explore" title="By type of irregularity"
        desc="The Auditor-General groups findings into types such as cash, tax, payroll and contracts. This page adds them up across reports." />

      <Section title="2023 mix, all reports combined">
        <div className="grid cols-2">
          <ChartCard title="All types" sub="Debts and loans dwarf everything else">
            <RankedBars items={mix} />
          </ChartCard>
          <ChartCard title="Excluding debts and loans" sub="The same data, rescaled so the rest is visible">
            <RankedBars items={mixNoDebt} />
          </ChartCard>
        </div>
      </Section>

      <Section title="One type over time" sub="Choose a type to see which reports it came from, 2019–2023">
        <ChartCard>
          <CategoryExplorer categories={present.map((c) => ({ name: c, color: categoryColor(c) }))} rowsByCategory={rowsByCategory} series={series} />
          <DataTable head={["Type", ...years.map(String)]}
            rows={present.map((c) => [c, ...rowsByCategory[c].map((row) => full(series.reduce((s, x) => s + ((row[x.key] as number) ?? 0), 0)))])} />
        </ChartCard>
      </Section>

      <Section title="What each type means">
        <div className="card">
          {present.map((c) => (
            <div className="field-row" key={c}>
              <span><span className="swatch" style={{ background: categoryColor(c), display: "inline-block", marginRight: 8 }} /><strong>{c}</strong></span>
              <span className="k" style={{ maxWidth: 560, textAlign: "right" }}>{DEFINITIONS[c]}</span>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
