import type { MetadataRoute } from "next";
import { allReports } from "@/lib/data";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/trends/", "/themes/", "/categories/", "/regions/", "/recoveries/", "/reports/", "/about/", "/government/ghana-debt/"];
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "monthly" as const, priority: p === "/" ? 1 : 0.8 })),
    ...allReports.map((r) => ({ url: `${SITE_URL}/reports/${r.slug}/`, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
