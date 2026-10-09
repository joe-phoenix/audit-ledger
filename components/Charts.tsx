"use client";

import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { useEffect, useState } from "react";
import { ghs, full } from "@/lib/format";

function useNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const m = matchMedia("(max-width: 640px)");
    const on = () => setNarrow(m.matches);
    on(); m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return narrow;
}

const axisProps = {
  stroke: "var(--axis)",
  tick: { fill: "var(--muted)", fontSize: 12, fontFamily: "JetBrains Mono, monospace" },
  tickLine: false,
};

type TipPayload = { name?: string; value?: number; color?: string; payload?: Record<string, unknown> }[];

function Tip({ active, payload, label, showTotal }: { active?: boolean; payload?: TipPayload; label?: string | number; showTotal?: boolean }) {
  if (!active || !payload?.length) return null;
  const rows = payload.filter((p) => p.value != null && p.value !== 0);
  const total = rows.reduce((s, p) => s + (p.value ?? 0), 0);
  return (
    <div className="tt">
      <div className="tt-title">{label ?? (payload[0].payload?.name as string)}</div>
      {rows.map((p) => (
        <div className="tt-row" key={p.name}>
          <span><span className="swatch" style={{ background: p.color, display: "inline-block", marginRight: 6 }} />{p.name}</span>
          <span className="mono">{full(p.value!)}</span>
        </div>
      ))}
      {showTotal && rows.length > 1 && (
        <div className="tt-row" style={{ borderTop: "1px solid var(--line)", marginTop: 4, paddingTop: 4 }}>
          <span>Total</span><span className="mono">{full(total)}</span>
        </div>
      )}
    </div>
  );
}

/** Fit long institution names into a narrow axis; full name stays in the tooltip. */
function shortLabel(name: string) {
  const s = name.replace(/^Ministry of (the )?/, "Min. ").replace(/ \(.*\)$/, "").replace(" & ", " & ");
  return s.length > 18 ? `${s.slice(0, 17)}…` : s;
}

export type Item = { name: string; total: number; color?: string };

/** Horizontal ranked bars: one series, sorted largest first. */
export function RankedBars({ items, color = "var(--s1)", height }: { items: Item[]; color?: string; height?: number }) {
  const narrow = useNarrow();
  const data = [...items].sort((a, b) => b.total - a.total);
  const h = height ?? Math.max(160, data.length * 34 + 30);
  return (
    <ResponsiveContainer width="100%" height={h}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: narrow ? 62 : 72, left: 0, bottom: 0 }} barCategoryGap={6}>
        <CartesianGrid horizontal={false} stroke="var(--grid)" />
        <XAxis type="number" {...axisProps} tickFormatter={(v) => ghs(v, 1)} tickCount={narrow ? 3 : 5} />
        <YAxis type="category" dataKey="name" width={narrow ? 116 : 170} {...axisProps} tickFormatter={narrow ? shortLabel : undefined} tick={{ ...axisProps.tick, fontSize: narrow ? 11 : 12, fontFamily: "DM Sans, sans-serif" }} interval={0} />
        <Tooltip content={<Tip />} cursor={{ fill: "var(--line)", opacity: 0.5 }} />
        <Bar dataKey="total" name="Irregularities" radius={[0, 4, 4, 0]} isAnimationActive={false}
          label={{ position: "right", formatter: (v: number) => ghs(v), fill: "var(--slate)", fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}>
          {data.map((d) => <Cell key={d.name} fill={d.color ?? color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export type SeriesDef = { key: string; label: string; color: string };

/** Stacked vertical bars by year: parts of a whole over time. */
export function StackedYears({ data, series, height = 320 }: { data: Record<string, number | null>[]; series: SeriesDef[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="28%">
        <CartesianGrid vertical={false} stroke="var(--grid)" />
        <XAxis dataKey="year" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(v) => ghs(v, 0)} width={72} />
        <Tooltip content={<Tip showTotal />} cursor={{ fill: "var(--line)", opacity: 0.5 }} />
        <Legend content={() => <LegendRow series={series} />} verticalAlign="top" />
        {series.map((s, i) => (
          <Bar key={s.key} dataKey={s.key} name={s.label} stackId="a" fill={s.color} stroke="var(--card)" strokeWidth={2}
            radius={i === series.length - 1 ? [4, 4, 0, 0] : 0} isAnimationActive={false} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Simple year bars for one total, with the latest year emphasised. */
export function YearBars({ years, totals, height = 260 }: { years: number[]; totals: number[]; height?: number }) {
  const data = years.map((y, i) => ({ year: y, total: totals[i] }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 22, right: 8, left: 0, bottom: 0 }} barCategoryGap="30%">
        <CartesianGrid vertical={false} stroke="var(--grid)" />
        <XAxis dataKey="year" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(v) => ghs(v, 0)} width={72} />
        <Tooltip content={<Tip />} cursor={{ fill: "var(--line)", opacity: 0.5 }} />
        <Bar dataKey="total" name="Total irregularities" radius={[4, 4, 0, 0]} isAnimationActive={false}
          label={{ position: "top", formatter: (v: number) => ghs(v), fill: "var(--slate)", fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}>
          {data.map((d, i) => <Cell key={d.year} fill={i === data.length - 1 ? "var(--s1)" : "color-mix(in srgb, var(--s1) 45%, var(--card))"} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Lines over years: compare series whose scales are similar. */
export function YearLines({ data, series, height = 320 }: { data: Record<string, number | null>[]; series: SeriesDef[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--grid)" />
        <XAxis dataKey="year" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(v) => ghs(v, 0)} width={72} />
        <Tooltip content={<Tip />} cursor={{ stroke: "var(--axis)", strokeDasharray: "3 3" }} />
        <Legend content={() => <LegendRow series={series} />} verticalAlign="top" />
        {series.map((s) => (
          <Line key={s.key} dataKey={s.key} name={s.label} stroke={s.color} strokeWidth={2} connectNulls={false}
            dot={{ r: 4, fill: s.color, stroke: "var(--card)", strokeWidth: 2 }} activeDot={{ r: 6 }} isAnimationActive={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function LegendRow({ series }: { series: SeriesDef[] }) {
  return (
    <div className="legend-row">
      {series.map((s) => (
        <span key={s.key}><span className="swatch" style={{ background: s.color }} />{s.label}</span>
      ))}
    </div>
  );
}

/** Horizontal stacked bars: parts of a whole per named item (e.g. region). */
export function StackedRanked({ data, series }: { data: Record<string, number | string>[]; series: SeriesDef[] }) {
  return (
    <ResponsiveContainer width="100%" height={data.length * 30 + 60}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }} barCategoryGap={5}>
        <CartesianGrid horizontal={false} stroke="var(--grid)" />
        <XAxis type="number" {...axisProps} tickFormatter={(v) => ghs(v, 0)} />
        <YAxis type="category" dataKey="name" width={110} {...axisProps} tick={{ ...axisProps.tick, fontFamily: "DM Sans, sans-serif" }} interval={0} />
        <Tooltip content={<Tip showTotal />} cursor={{ fill: "var(--line)", opacity: 0.5 }} />
        <Legend content={() => <LegendRow series={series} />} verticalAlign="top" />
        {series.map((s, i) => (
          <Bar key={s.key} dataKey={s.key} name={s.label} stackId="a" fill={s.color} stroke="var(--card)" strokeWidth={2}
            radius={i === series.length - 1 ? [0, 4, 4, 0] : 0} isAnimationActive={false} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
