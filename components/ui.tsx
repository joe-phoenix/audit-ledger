import Link from "next/link";
import type { ReactNode } from "react";

export function Section({ id, title, sub, right, children }: { id?: string; title: string; sub?: string; right?: ReactNode; children: ReactNode }) {
  return (
    <section className="section" id={id}>
      <div className="section-head">
        <div><h2>{title}</h2>{sub && <div className="subhead">{sub}</div>}</div>
        {right}
      </div>
      {children}
    </section>
  );
}

export function Stat({ label, value, delta, tone, href }: { label: string; value: string; delta?: ReactNode; tone?: "bad" | "good"; href?: string }) {
  return (
    <div className="card stat-card">
      <div className="label">{label}</div>
      <div className={`value${tone ? ` tone-${tone}` : ""}`}>{value}</div>
      {delta && <div className="delta">{delta}</div>}
      {href && <Link className="stat-link" href={href}>See the breakdown <span aria-hidden="true">→</span></Link>}
    </div>
  );
}

export function ChartCard({ title, sub, foot, children }: { title?: string; sub?: string; foot?: ReactNode; children: ReactNode }) {
  return (
    <div className="card chart-card">
      {title && <h3 className="chart-title">{title}</h3>}
      {sub && <p className="chart-sub">{sub}</p>}
      {children}
      {foot && <div className="chart-foot">{foot}</div>}
    </div>
  );
}

export function PageHead({ eyebrow, title, desc, badge, children }: { eyebrow: string; title: string; desc?: ReactNode; badge?: ReactNode; children?: ReactNode }) {
  return (
    <div className="page-head">
      <div className="eyebrow">{eyebrow} {badge}</div>
      <h1>{title}</h1>
      {desc && <div className="desc">{desc}</div>}
      {children}
    </div>
  );
}

/** Accessible table view behind every chart. */
export function DataTable({ head, rows, summary = "Show data table" }: { head: string[]; rows: (string | number)[][]; summary?: string }) {
  return (
    <details className="details-table">
      <summary>{summary}</summary>
      <div className="table-wrap" style={{ marginTop: 10 }}>
        <table className="data-table">
          <thead><tr>{head.map((h, i) => <th key={h} style={i ? { textAlign: "right" } : undefined}>{h}</th>)}</tr></thead>
          <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className={j ? "num" : undefined}>{c}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </details>
  );
}
