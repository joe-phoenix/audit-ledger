import { CATEGORIES, type Series } from "@/lib/data";

// Validated reference categorical palette, fixed order (see app/globals.css --s1..--s8).
const slot = (i: number) => `var(--s${i + 1})`;

export const categoryColor = (cat: string) => {
  const i = (CATEGORIES as readonly string[]).indexOf(cat);
  return i === -1 ? "var(--slate)" : slot(i);
};

const SERIES_ORDER: Series[] = [
  "public-boards", "mda", "dacf", "technical-universities", "district-igf", "colleges-of-education", "pre-university",
];
export const seriesColor = (s: Series) => slot(SERIES_ORDER.indexOf(s));
