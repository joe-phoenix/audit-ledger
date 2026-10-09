"use client";

import { useState } from "react";
import { StackedYears } from "./Charts";

type Props = {
  categories: { name: string; color: string }[];
  rowsByCategory: Record<string, Record<string, number | null>[]>;
  series: { key: string; label: string; color: string }[];
};

export function CategoryExplorer({ categories, rowsByCategory, series }: Props) {
  const [cat, setCat] = useState(categories[0].name);
  return (
    <>
      <div className="toolbar">
        <div className="seg" role="group" aria-label="Irregularity type">
          {categories.map((c) => (
            <button key={c.name} aria-pressed={cat === c.name} onClick={() => setCat(c.name)}>{c.name}</button>
          ))}
        </div>
      </div>
      <StackedYears data={rowsByCategory[cat]} series={series} />
    </>
  );
}
