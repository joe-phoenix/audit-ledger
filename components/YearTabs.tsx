"use client";

import { useState, type ReactNode } from "react";

/** Switch between server-rendered panels, one per year. */
export function YearTabs({ panels }: { panels: { year: number; node: ReactNode }[] }) {
  const [year, setYear] = useState(panels[0].year);
  return (
    <>
      <div className="toolbar">
        <div className="seg" role="group" aria-label="Year">
          {panels.map((p) => (
            <button key={p.year} aria-pressed={p.year === year} onClick={() => setYear(p.year)}>{p.year}</button>
          ))}
        </div>
      </div>
      {panels.find((p) => p.year === year)!.node}
    </>
  );
}
