# The Audit Ledger

Ghana's Auditor-General reports turned into clear charts: irregularities by type, year, institution and region, and what was recovered. A sibling project to Labari Data. No sign-up, no tracking.

Built with Next.js (App Router, static export) and Recharts. The build output in `out/` is plain static files that can be hosted on GitHub Pages, Netlify or Vercel.

## Run it

```bash
npm install
npm run dev        # http://localhost:8420
npm run build      # static site in out/
```

## Structure

- `data/reports/<slug>.json`: one file per Auditor-General report (totals, type breakdown, multi-year trend, by-institution or by-region breakdown, highlights, notes, source table references).
- `data/overview.json`: consolidated totals across all reports, plus recovery figures (secondary sources).
- `lib/data.ts`: loads and types the data; register new report files here.
- `app/`: pages: overview `/`, `/trends`, `/categories`, `/regions`, `/recoveries`, `/about`, `/reports`, `/reports/[slug]`.
- `components/`: charts (`Charts.tsx`), explorers with filters, navigation, UI primitives.
- `public/government/ghana-debt/`: the original static Ghana Debt dashboard (with its live Cloudflare Worker data), served unchanged. Only works under `npm run build` output, not `next dev`.

## Adding a report

1. Download the official PDF from audit.gov.gh and extract text (`pdftotext -layout`).
2. Copy an existing `data/reports/*.json` and fill it from the report's summary tables. Cite the table/appendix in each `source` field. Check that category, institution and region breakdowns each sum to the report total.
3. Add it to the `reports` array in `lib/data.ts`. The report page, navigation and overview charts pick it up automatically.

## Status

| Report (FY 2023) | Total | Trend | Breakdown |
|---|---|---|---|
| Public Boards, Corporations & SOEs | GH¢8.80bn | 2019–2023 | 19 sector ministries |
| Ministries, Departments & Agencies | GH¢2.40bn | 2019–2023 | 15 ministries |
| District Assemblies Common Fund | GH¢49.7m | 2019–2023 | 16 regions |
| Technical Universities | GH¢45.6m | 2019–2023 | 10 universities |
| District Assemblies — own revenue (IGF) | GH¢22.2m | 2021–2023 | 16 regions |
| Colleges of Education | GH¢8.0m | 2023 only | 15 regions |
| Pre-University Institutions | GH¢7.5m | 2021–2023 | 16 regions |

All six 2023 Auditor-General annual reports are in, verified from the official PDFs. Technical universities and colleges of education come from one report but are shown as two series, because only the universities have a multi-year table. Source quirks are recorded in each file's `notes` (e.g. the IGF report's text total vs table total, and `#REF!` cells for Upper West in its Appendix D).

**2022:** all six reports are in (GH¢16.57bn, matching the official consolidated figure). In 2022 colleges of education were audited with pre-university institutions, so that report sits under the pre-university series.

**2024:** all six reports are in, GH¢20.74bn in total (up 83%), and the overview pages now show 2024. From 2024 the universities report covers all 20 public universities, so the "Universities" series continues the technical-university trend with a change in scope. Colleges of education are shown separately.

| Report (FY 2024) | Total | Change on 2023 |
|---|---|---|
| Public Boards, Corporations & SOEs | GH¢18.42bn | +109% |
| Ministries, Departments & Agencies | GH¢2.06bn | −15% |
| District Assemblies Common Fund | GH¢205.9m | +315% |
| Pre-University Institutions | GH¢23.4m | +213% |
| District Assemblies — own revenue (IGF) | GH¢18.9m | −15% |
| Public Universities (incl. technical) | GH¢17.5m | n/a (wider scope) |
| Colleges of Education | GH¢5.9m | −25% |

**2019–2021:** 15 more reports, so every year from 2019 to 2024 has its own report pages. 2020 has only three (MDAs, public boards, Common Fund), because the Audit Service didn't publish full pre-university, technical-university or IGF reports for that year. The 2019 Common Fund report has no regional split, so its breakdown shows the largest findings instead. Several of these reports are scans; their tables were read from rendered pages and checked against the report totals, with any mismatch recorded in `notes`.

Trend charts now reach back to 2015–2017, using the comparison tables in the older reports.

Note: the GH¢8.80bn / −41.6% figure widely cited in the news is the Public Boards report total, not a consolidated total. The consolidated 2023 figure across all six reports is GH¢11.32bn (the six reports here sum to GH¢11.33bn).
