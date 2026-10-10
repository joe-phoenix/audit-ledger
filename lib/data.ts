import mda2023 from "@/data/reports/mda-2023.json";
import publicBoards2023 from "@/data/reports/public-boards-2023.json";
import dacf2023 from "@/data/reports/dacf-2023.json";
import preUniversity2023 from "@/data/reports/pre-university-2023.json";
import technicalUniversities2023 from "@/data/reports/technical-universities-2023.json";
import collegesOfEducation2023 from "@/data/reports/colleges-of-education-2023.json";
import districtIgf2023 from "@/data/reports/district-assemblies-igf-2023.json";
import overviewData from "@/data/overview.json";
import { EARLIER } from "@/data/reports/earlier";

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

// Every report, any year. Add new report JSON files here.
export const allReports: Report[] = [
  publicBoards2023, mda2023, dacf2023, technicalUniversities2023, districtIgf2023, collegesOfEducation2023, preUniversity2023,
  ...EARLIER,
] as Report[];

export const LATEST_YEAR = Math.max(...allReports.map((r) => r.year));

/** Latest report per series, ordered largest-first. Overview charts use these: their trend tables already span earlier years. */
export const reports: Report[] = allReports
  .filter((r) => r.year === LATEST_YEAR)
  .sort((a, b) => b.total - a.total);

export const reportYears = Array.from(new Set(allReports.map((r) => r.year))).sort((a, b) => b - a);

/** All years of one series, newest first. */
export function seriesReports(series: Series) {
  return allReports.filter((r) => r.series === series).sort((a, b) => b.year - a.year);
}

export const overview = overviewData;

export const seriesLabel: Record<Series, string> = {
  "public-boards": "Public Boards & SOEs",
  mda: "MDAs",
  dacf: "District Assemblies — Common Fund",
  "technical-universities": "Universities",
  "district-igf": "District Assemblies — Own Revenue",
  "colleges-of-education": "Colleges of Education",
  "pre-university": "Pre-University",
};

// Fixed categorical order so a category keeps its color on every chart.
export const CATEGORIES = ["Debts/Loans", "Tax", "Contract", "Cash", "Procurement/Stores", "Payroll", "Rent", "Sanitation"] as const;

export function getReport(slug: string) {
  return allReports.find((r) => r.slug === slug);
}

export const allSeries = Array.from(new Set(allReports.map((r) => r.series)));

/**
 * One series' history, merged across every report in it. Each report's comparison table
 * covers several years; where tables overlap, the newest report's figure wins.
 */
export function seriesHistory(series: Series) {
  const points = new Map<number, { total: number; categories: Record<string, number> }>();
  for (const r of [...seriesReports(series)].reverse()) {
    r.trend.years.forEach((y, i) => {
      points.set(y, {
        total: r.trend.totals[i],
        categories: Object.fromEntries(Object.entries(r.trend.categories).map(([c, v]) => [c, v[i] ?? 0])),
      });
    });
  }
  return points;
}

/** Series that have a figure for this year, largest first. */
export function seriesInYear(year: number) {
  return allSeries
    .map((s) => ({ series: s, total: seriesHistory(s).get(year)?.total }))
    .filter((x): x is { series: Series; total: number } => x.total != null)
    .sort((a, b) => b.total - a.total);
}

/** Totals per year per series, for every year any report covers. */
export function seriesTrend() {
  const hist = new Map(allSeries.map((s) => [s, seriesHistory(s)]));
  const years = Array.from(new Set([...hist.values()].flatMap((h) => [...h.keys()]))).sort();
  return years.map((year) => {
    const row: Record<string, number | null> & { year: number } = { year };
    for (const [s, h] of hist) row[s] = h.get(year)?.total ?? null;
    return row;
  });
}

/** Category totals summed across every series for one year. */
export function combinedCategories(year: number) {
  const sums: Record<string, number> = {};
  for (const s of allSeries) {
    const p = seriesHistory(s).get(year);
    if (!p) continue;
    for (const [cat, v] of Object.entries(p.categories)) sums[cat] = (sums[cat] ?? 0) + v;
  }
  return CATEGORIES.filter((c) => sums[c]).map((c) => ({ name: c, total: sums[c] }));
}

/** Each series as one merged record: its latest report plus its full multi-year trend. */
export function seriesSummaries() {
  return allSeries
    .map((s) => {
      const latest = seriesReports(s)[0];
      const h = seriesHistory(s);
      const years = [...h.keys()].sort();
      const cats = Array.from(new Set(years.flatMap((y) => Object.keys(h.get(y)!.categories))));
      return {
        ...latest,
        trend: {
          ...latest.trend,
          years,
          totals: years.map((y) => h.get(y)!.total),
          categories: Object.fromEntries(cats.map((c) => [c, years.map((y) => h.get(y)!.categories[c] ?? 0)])),
        },
      };
    })
    .sort((a, b) => b.year - a.year || b.total - a.total);
}
