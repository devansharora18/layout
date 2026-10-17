---
name: pdf
description: Use when the task is to generate a PDF file from scratch using Python (reports, invoices, certificates, exported data, generated charts/pages). Not for editing prose-heavy documents (see the docs skill) or for reading/merging/splitting existing PDFs.
---

# PDF Generation (Python)

## Library choice

- **reportlab** — default choice for most generated PDFs (reports, invoices, tables, mixed text/layout). Good control, no browser dependency.
- **weasyprint** — when the content is easiest to express as HTML/CSS (e.g. reusing a web template, complex responsive-style layout). Renders HTML+CSS to PDF directly.
- **fpdf2** — for simple, short documents where reportlab's API is overkill.

Pick one per project and stay consistent — don't mix libraries across a single document.

## Structure

- Build multi-page or structured documents with reportlab's `Platypus` (`SimpleDocTemplate` + `Paragraph`/`Table`/`Spacer`), not raw `canvas` calls with manually tracked x/y — canvas is fine only for single-page, fixed-layout content (certificates, labels).
- Define styles once (`getSampleStyleSheet()` + custom overrides) and reuse them — don't hardcode font/size per paragraph.
- For tabular data, use `Table`/`TableStyle`, not manually positioned `drawString` calls.

## Text gotchas

- **Never use Unicode subscript/superscript characters** (₀₁₂, ⁰¹²) — reportlab's built-in fonts don't have these glyphs and they render as black boxes. Use `<sub>`/`<super>` XML tags inside a `Paragraph` instead.
- Escape user-provided text before inserting into `Paragraph` XML (`&`, `<`, `>`) or it will break rendering / allow injection into the markup.
- Register a real font (e.g. a bundled TTF via `pdfmetrics.registerFont`) if the content needs anything beyond basic Latin — built-in fonts don't cover most non-Latin scripts.

## Layout

- Respect page margins consistently; don't let content bleed to the edge.
- Handle page breaks explicitly for long content (`PageBreak()`) rather than letting tables/images split awkwardly — set `repeatRows=1` on tables that span pages so headers repeat.
- Images: check dimensions before placing them, scale to fit the content width, don't let them overflow the page.

## Workflow

- Generate to a temp/output path, then verify page count and that no exceptions were swallowed — a PDF that "generates" with silently-dropped content is worse than an explicit failure.
- For data-driven PDFs (reports from a DB/API), separate data-fetching from rendering — a `build_pdf(data: dict) -> bytes` function that takes plain data in, so it's testable without hitting the DB.