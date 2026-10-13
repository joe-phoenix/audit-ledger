import type { Metadata } from "next";

export const SITE_URL = "https://auditledger.labaridata.com";
export const SITE_NAME = "The Audit Ledger";
export const OG_IMAGE = { url: "/og.png", width: 1200, height: 630, alt: "The Audit Ledger: Ghana's Auditor-General reports, visualised" };

/**
 * Per-page metadata: title, description, canonical URL and share-card text.
 * Next replaces (not merges) a page's openGraph object, so the share image is repeated here.
 */
export function pageMeta(path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} · ${SITE_NAME}`, description, url: path, siteName: SITE_NAME, type: "website", locale: "en_GH", images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title: `${title} · ${SITE_NAME}`, description, images: [OG_IMAGE.url] },
  };
}

/** Render schema.org JSON-LD. `<` is escaped so data can't close the script tag. */
export function jsonLd(data: object) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
