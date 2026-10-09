import mda2023 from "@/data/reports/mda-2023.json";
import publicBoards2023 from "@/data/reports/public-boards-2023.json";
import dacf2023 from "@/data/reports/dacf-2023.json";
import preUniversity2023 from "@/data/reports/pre-university-2023.json";
import technicalUniversities2023 from "@/data/reports/technical-universities-2023.json";
import collegesOfEducation2023 from "@/data/reports/colleges-of-education-2023.json";
import districtIgf2023 from "@/data/reports/district-assemblies-igf-2023.json";
import overviewData from "@/data/overview.json";

export type Series = "mda" | "public-boards" | "dacf" | "technical-universities" | "district-igf" | "colleges-of-education" | "pre-university";

export interface Report {
  slug: string;
  series: Series;
  year: number;
  title: string;
  shortTitle: string;
  period: string;
  sourceUrl: string;
  status: "verified" | "placeholder";
  institutionsAudited?: number;
  institutionsAuditedPrior?: number;
  total: number;
  recoverable?: number;
  administrative?: number;
  categories: Record<string, number>;
  trend: { years: number[]; source: string; totals: number[]; categories: Record<string, number[]> };
  breakdown: { kind: "institution" | "region"; label: string; source: string; items: { name: string; total: number }[] };
  highlights: { text: string; amount: string }[];
  notes: string[];
}

// Ordered largest-first by 2023 total. Add new report JSON files here.
export const reports: Report[] = [
  publicBoards2023, mda2023, dacf2023, technicalUniversities2023, districtIgf2023, collegesOfEducation2023, preUniversity2023,
] as Report[];

export const overview = overviewData;

export const seriesLabel: Record<Series, string> = {
  "public-boards": "Public Boards & SOEs",
  mda: "MDAs",
  dacf: "District Assemblies — Common Fund",
  "technical-universities": "Technical Universities",
  "district-igf": "District Assemblies — Own Revenue",
  "colleges-of-education": "Colleges of Education",
  "pre-university": "Pre-University",
};

// Fixed categorical order so a category keeps its color on every chart.
export const CATEGORIES = ["Debts/Loans", "Tax", "Contract", "Cash", "Procurement/Stores", "Payroll", "Rent", "Sanitation"] as const;

export function getReport(slug: string) {
  return reports.find((r) => r.slug === slug);
}

/** Totals per year per series, for every year any report covers. */
export function seriesTrend() {
  const years = Array.from(new Set(reports.flatMap((r) => r.trend.years))).sort();
  return years.map((year) => {
    const row: Record<string, number | null> & { year: number } = { year };
    for (const r of reports) {
      const i = r.trend.years.indexOf(year);
      row[r.series] = i === -1 ? null : r.trend.totals[i];
    }
    return row;
  });
}

/** Category totals summed across every report for one year. */
export function combinedCategories(year: number) {
  const sums: Record<string, number> = {};
  for (const r of reports) {
    const i = r.trend.years.indexOf(year);
    if (i === -1) continue;
    for (const [cat, vals] of Object.entries(r.trend.categories)) sums[cat] = (sums[cat] ?? 0) + (vals[i] ?? 0);
  }
  return CATEGORIES.filter((c) => sums[c]).map((c) => ({ name: c, total: sums[c] }));
}
