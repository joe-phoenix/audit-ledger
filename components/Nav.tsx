"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { reports, seriesLabel } from "@/lib/data";
import { ghs } from "@/lib/format";

const explore = [
  { href: "/", label: "Overview" },
  { href: "/trends/", label: "Trends over years" },
  { href: "/categories/", label: "By irregularity type" },
  { href: "/regions/", label: "By region" },
  { href: "/recoveries/", label: "Recoveries" },
];

export function Sidebar() {
  const path = usePathname();
  const cls = (href: string) => `nav-link${path === href ? " active" : ""}`;
  return (
    <aside className="sidebar">
      <Link className="brand" href="/">The Audit Ledger<span className="dot">.</span></Link>
      <div className="nav-group">
        <div className="nav-label">Explore</div>
        {explore.map((l) => <Link key={l.href} className={cls(l.href)} href={l.href}>{l.label}</Link>)}
      </div>
      <div className="nav-group">
        <div className="nav-label">2023 reports</div>
        {reports.map((r) => (
          <Link key={r.slug} className={cls(`/reports/${r.slug}/`)} href={`/reports/${r.slug}/`}>
            {seriesLabel[r.series]} <span className="amt">{ghs(r.total, 1)}</span>
          </Link>
        ))}
      </div>
      <div className="nav-group">
        <div className="nav-label">More</div>
        <a className="nav-link" href={`${process.env.NEXT_PUBLIC_BASE_PATH}/government/ghana-debt/`}>Ghana Debt</a>
        <Link className={cls("/about/")} href="/about/">About the data</Link>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const path = usePathname();
  return (
    <nav className="mobile-nav" aria-label="Sections">
      {[...explore, { href: "/reports/", label: "Reports" }, { href: "/about/", label: "About" }].map((l) => (
        <Link key={l.href} href={l.href} className={path === l.href ? "active" : ""}>{l.label}</Link>
      ))}
    </nav>
  );
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<string | null>(null);
  useEffect(() => {
    try { const t = localStorage.getItem("theme"); if (t) { document.documentElement.dataset.theme = t; setTheme(t); } } catch {}
  }, []);
  const next = () => {
    const dark = theme ? theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    const t = dark ? "light" : "dark";
    document.documentElement.dataset.theme = t;
    setTheme(t);
    try { localStorage.setItem("theme", t); } catch {}
  };
  return <button className="theme-toggle" onClick={next} aria-label="Toggle dark mode">◐ Theme</button>;
}
