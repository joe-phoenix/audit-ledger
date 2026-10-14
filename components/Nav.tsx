"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getReport, reports, seriesLabel } from "@/lib/data";
import { ghs } from "@/lib/format";

const explore = [
  { href: "/", label: "Overview" },
  { href: "/trends/", label: "Trends over years" },
  { href: "/themes/", label: "Recurring themes" },
  { href: "/categories/", label: "By irregularity type" },
  { href: "/regions/", label: "By region" },
  { href: "/recoveries/", label: "Recoveries" },
];

export function Sidebar() {
  const path = usePathname();
  const cls = (href: string) => `nav-link${path === href ? " active" : ""}`;
  const cur = (href: string) => (path === href ? "page" as const : undefined);
  return (
    <nav className="sidebar" aria-label="Main">
      <Link className="brand" href="/">The Audit Ledger<span className="dot">.</span></Link>
      <p className="tagline">Ghana&apos;s Auditor-General reports, visualised</p>
      <div className="nav-group">
        <div className="nav-label">Explore</div>
        {explore.map((l) => <Link key={l.href} className={cls(l.href)} aria-current={cur(l.href)} href={l.href}>{l.label}</Link>)}
      </div>
      <div className="nav-group">
        <div className="nav-label">Latest reports</div>
        {reports.map((r) => (
          <Link key={r.slug} className={cls(`/reports/${r.slug}/`)} aria-current={cur(`/reports/${r.slug}/`)} href={`/reports/${r.slug}/`}>
            {seriesLabel[r.series]} <span className="amt">{ghs(r.total, 1)}</span>
          </Link>
        ))}
      </div>
      <div className="nav-group">
        <div className="nav-label">More</div>
        <a className="nav-link" href={`${process.env.NEXT_PUBLIC_BASE_PATH}/government/ghana-debt/`}>Ghana Debt</a>
        <Link className={cls("/reports/")} aria-current={cur("/reports/")} href="/reports/">All reports</Link>
        <Link className={cls("/about/")} aria-current={cur("/about/")} href="/about/">About the data</Link>
      </div>
    </nav>
  );
}

export function MobileNav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  const links = [...explore, { href: "/reports/", label: "All reports" }, { href: "/about/", label: "About the data" }];
  return (
    <div className="mobile-nav">
      <button className="menu-btn" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
        <span aria-hidden="true">{open ? "✕" : "☰"}</span> Menu
      </button>
      {open && (
        <nav id="mobile-menu" className="mobile-menu" aria-label="Main">
          <div className="nav-label">Explore</div>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`nav-link${path === l.href ? " active" : ""}`} aria-current={path === l.href ? "page" : undefined}>{l.label}</Link>
          ))}
          <div className="nav-label">Latest reports</div>
          {reports.map((r) => {
            const href = `/reports/${r.slug}/`;
            return (
              <Link key={r.slug} href={href} className={`nav-link${path === href ? " active" : ""}`} aria-current={path === href ? "page" : undefined}>
                {seriesLabel[r.series]} <span className="amt">{ghs(r.total, 1)}</span>
              </Link>
            );
          })}
          <div className="nav-label">More</div>
          <a className="nav-link" href={`${process.env.NEXT_PUBLIC_BASE_PATH}/government/ghana-debt/`}>Ghana Debt</a>
        </nav>
      )}
    </div>
  );
}

const pageLabels: Record<string, string> = Object.fromEntries([...explore.slice(1), { href: "/reports/", label: "All reports" }, { href: "/about/", label: "About the data" }].map((l) => [l.href, l.label]));

/** Where you are: Overview › section › report. */
export function Breadcrumbs() {
  const path = usePathname();
  const trail: { href?: string; label: string }[] = [];
  const m = path.match(/^\/reports\/([^/]+)\/$/);
  if (m) {
    const r = getReport(m[1]);
    trail.push({ href: "/reports/", label: "All reports" }, { label: r ? `${seriesLabel[r.series]} ${r.year}` : "Report" });
  } else if (pageLabels[path]) trail.push({ label: pageLabels[path] });
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        <li>{trail.length ? <Link href="/">Overview</Link> : <span aria-current="page">Overview</span>}</li>
        {trail.map((t, i) => (
          <li key={t.label}>{t.href ? <Link href={t.href}>{t.label}</Link> : <span aria-current={i === trail.length - 1 ? "page" : undefined}>{t.label}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<string | null>(null);
  useEffect(() => {
    let t: string | null = null;
    try { t = localStorage.getItem("theme"); } catch {}
    if (t) document.documentElement.dataset.theme = t;
    setTheme(t ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  }, []);
  const next = () => {
    const dark = theme === "dark";
    const t = dark ? "light" : "dark";
    document.documentElement.dataset.theme = t;
    setTheme(t);
    try { localStorage.setItem("theme", t); } catch {}
  };
  const dark = theme === "dark";
  return (
    <button className="theme-toggle" onClick={next} aria-pressed={dark}>
      <span aria-hidden="true">{dark ? "☾" : "☀"}</span> Dark mode
    </button>
  );
}
