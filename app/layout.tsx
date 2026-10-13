import type { Metadata } from "next";
import "./globals.css";
import { Breadcrumbs, MobileNav, Sidebar, ThemeToggle } from "@/components/Nav";
import { OG_IMAGE, SITE_NAME, SITE_URL, jsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: "Ghana's Auditor-General reports turned into clear charts: irregularities by type, year, institution and region, and what was recovered.",
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  keywords: ["Ghana", "Auditor-General report", "Ghana Audit Service", "public finance", "public accounts", "financial irregularities", "governance", "accountability", "transparency", "open data", "public sector audit", "SOEs", "MMDAs", "District Assemblies Common Fund"],
  authors: [{ name: "Labari Data", url: "https://labaridata.com" }],
  publisher: "Labari Data",
  category: "Government and public finance data",
  openGraph: { siteName: SITE_NAME, type: "website", locale: "en_GH", images: [OG_IMAGE] },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
};

const siteLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": "https://labaridata.com/#org", name: "Labari Data", url: "https://labaridata.com" },
    {
      "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: `${SITE_URL}/`, inLanguage: "en-GH",
      description: "Ghana's Auditor-General reports on the public accounts, turned into charts and tables: financial irregularities by type, year, institution and region.",
      publisher: { "@id": "https://labaridata.com/#org" },
      about: ["Public finance in Ghana", "Government audit", "Public sector governance and accountability"],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(siteLd)} />
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
