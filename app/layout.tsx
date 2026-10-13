import type { Metadata } from "next";
import "./globals.css";
import { Breadcrumbs, MobileNav, Sidebar, ThemeToggle } from "@/components/Nav";

export const metadata: Metadata = {
  title: { default: "The Audit Ledger", template: "%s · The Audit Ledger" },
  description: "Ghana's Auditor-General reports turned into clear charts: irregularities by type, year, institution and region, and what was recovered.",
  metadataBase: new URL("https://auditledger.labaridata.com"),
  openGraph: {
    siteName: "The Audit Ledger", type: "website", locale: "en_GH",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "The Audit Ledger: Ghana's Auditor-General reports, visualised" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
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
        <a className="skip-link" href="#main">Skip to content</a>
        <div className="shell">
          <Sidebar />
          <div className="main">
            <div className="topbar">
              <Breadcrumbs />
              <ThemeToggle />
            </div>
            <MobileNav />
            <main id="main" className="content" tabIndex={-1}>{children}</main>
            <footer className="content" style={{ paddingTop: 0 }}>
              <p className="footnote">Figures transcribed from official Ghana Audit Service reports (audit.gov.gh), with the source table cited on each page. No sign-up, no tracking.</p>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
