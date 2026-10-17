---
name: docs
description: Use when the user wants documentation written — either informal docs to help someone understand a codebase/feature, or formal docs (backend docs, architecture docs, API docs, onboarding docs). Not for generating the PDF file itself — write the doc content here, then hand off to the pdf skill if a PDF is needed.
---

# Docs

## Two modes

**Understanding docs** — the user (or a future contributor) needs to grasp how something works. Optimize for a reader skimming with a real question in mind, not for completeness.
- Lead with what the thing does and why it exists, before how.
- Prefer a short example over a long explanation.
- Only document what's non-obvious from reading the code itself — don't restate function signatures line by line.

**Formal docs** — a deliverable meant to be shared/handed off (backend docs, architecture doc, API reference, onboarding guide).
- Structured, versioned, written to stand alone without the author present to clarify.
- If the user wants this as a PDF, **write the content as Markdown first, then use the `pdf` skill to convert it** — don't generate the PDF directly from scratch. Markdown-first means the content is reviewable/editable before it's locked into a PDF.

## Structure for formal docs (adapt, don't force every section)

1. **Title + one-line summary** — what this system/service is.
2. **Overview** — 2-4 sentences: purpose, scope, who it's for.
3. **Architecture / how it works** — diagram or bullet flow if there's a non-trivial data/request path.
4. **Setup / getting started** — only if someone needs to run it.
5. **Reference** — endpoints, schemas, config, whatever the reader needs to look up (use tables).
6. **Known limitations / gotchas** — real ones, not hedging filler.

## Writing rules

- Active voice, present tense, second person for instructions ("Run `X`", not "The user should run `X`").
- No filler intros ("In this document, we will..."). Start with the content.
- Short paragraphs, real headings, tables for anything tabular (params, status codes, config options) instead of prose lists.
- Code blocks for anything copy-pasteable; inline code for anything referenced by name (`functionName`, `ENV_VAR`).
- Don't restate what's already obvious from a well-named function/variable — document intent, edge cases, and *why*, not a line-by-line narration.
- Keep it current: a doc that describes behavior that's since changed is worse than no doc — note the doc's scope/version if the underlying system changes often.

## Backend docs specifically

- Document per-endpoint: method, path, auth requirement, request/response shape, error cases — as a table or consistent template repeated per endpoint, not freeform prose.
- Call out security-relevant behavior explicitly (what's authenticated, what's rate-limited, what a caller must not assume).
- Link back to the `backend` skill's conventions rather than re-explaining them here.

## Output

- Default output: a single Markdown file (or one per major section if it's long — keep each file browsable, no 2000-line doc dumps).
- If the user asks for a PDF: finish the Markdown, get it right, then invoke the `pdf` skill to render it — treat the Markdown as the source of truth, the PDF as an export.