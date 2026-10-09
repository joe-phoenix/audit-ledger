"use client";

import { useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";
import { LegendRow } from "./Charts";

type S = { key: string; label: string; color: string; years: number[]; totals: number[] };

/** Index every report to 100 in 2021 (the first year all four exist), so very different scales share one axis. */
export function TrendExplorer({ series: all }: { series: S[] }) {
  const series = all.filter((s) => s.years.includes(2021));
  const [on, setOn] = useState(() => new Set(series.map((s) => s.key)));
  const base = 2021;
  const years = Array.from(new Set(series.flatMap((s) => s.years))).sort();
  const data = years.map((y) => {
    const row: Record<string, number | null> = { year: y };
    for (const s of series) {
      const b = s.totals[s.years.indexOf(base)];
      const i = s.years.indexOf(y);
      row[s.key] = i === -1 ? null : Math.round((s.totals[i] / b) * 100);
    }
    return row;
  });
  const shown = series.filter((s) => on.has(s.key));
  const toggle = (k: string) => setOn((prev) => {
    const n = new Set(prev);
    if (n.has(k) && n.size > 1) n.delete(k); else n.add(k);
    return n;
  });

  return (
    <>
      <div className="toolbar">
        <div className="seg" role="group" aria-label="Reports shown">
          {series.map((s) => (
            <button key={s.key} aria-pressed={on.has(s.key)} onClick={() => toggle(s.key)}>{s.label}</button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--grid)" />
          <XAxis dataKey="year" stroke="var(--axis)" tickLine={false} tick={{ fill: "var(--muted)", fontSize: 12 }} />
          <YAxis stroke="var(--axis)" tickLine={false} tick={{ fill: "var(--muted)", fontSize: 12 }} width={44} />
          <ReferenceLine y={100} stroke="var(--axis)" strokeDasharray="3 3" />
          <Tooltip formatter={(v: number) => `${v} (2021 = 100)`} contentStyle={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 10, fontSize: 12 }} />
          {shown.map((s) => (
            <Line key={s.key} dataKey={s.key} name={s.label} stroke={s.color} strokeWidth={2}
              dot={{ r: 4, fill: s.color, stroke: "var(--card)", strokeWidth: 2 }} isAnimationActive={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <LegendRow series={shown} />
    </>
  );
}
