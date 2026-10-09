import type { Metadata } from "next";
import "./globals.css";
import { MobileNav, Sidebar, ThemeToggle } from "@/components/Nav";

export const metadata: Metadata = {
  title: { default: "The Audit Ledger", template: "%s · The Audit Ledger" },
  description: "Ghana's Auditor-General reports turned into clear charts: irregularities by type, year, institution and region, and what was recovered.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t}catch(e){}` }} />
      </head>
      <body>
        <div className="shell">
          <Sidebar />
          <div className="main">
            <div className="topbar">
              <div className="crumbs">Ghana · Auditor-General reports, visualised</div>
              <ThemeToggle />
            </div>
            <MobileNav />
            <div className="content">{children}</div>
            <footer className="content" style={{ paddingTop: 0 }}>
              <p className="footnote">Figures transcribed from official Ghana Audit Service reports (audit.gov.gh), with the source table cited on each page. No sign-up, no tracking.</p>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
