# The Audit Ledger

Government audit and accountability reports from Ghana, turned into visual data. A sibling project to Labari Data — same static-site, no-signup approach, focused specifically on governance/accountability reporting.

## Structure

- `index.html` — landing page, lists all reports.
- `reports/<report-slug>/index.html` — one page per report (e.g. `reports/mda-2023/`).
- `data/<report-slug>.json` — structured source data for that report (totals, category breakdown, per-institution figures). Report pages currently embed their numbers directly in a `<script>` block; the JSON files are the canonical record to transcribe into as reports are read.

## Workflow for adding a report

1. Download the official PDF from the issuing institution (currently Ghana Audit Service, audit.gov.gh).
2. Create/update `data/<report-slug>.json` with headline totals first, then category breakdowns, then per-institution rows as they're transcribed. Mark anything not yet transcribed with `"status": "placeholder"` rather than guessing.
3. Build/update `reports/<report-slug>/index.html` following the visual pattern in `reports/mda-2023/`.
4. Link it from `index.html`.

## Local preview

```bash
python3 -m http.server 8420
```

Then open `http://localhost:8420`.

## Status

- **2023 Auditor-General's Report on MDAs**: headline totals verified (total irregularities, recoverable vs. administrative split, institutions audited). Category-level and per-institution breakdowns still need to be transcribed from the full PDF.
