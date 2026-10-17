---
name: architecture
description: Use when starting a new project, adding a new module/feature, or restructuring an existing codebase. Covers folder structure, layering, and file-size discipline.
---

# Architecture

## Folder structure

- Structure by **feature/domain**, not by file type. Avoid global `controllers/`, `services/`, `utils/` dumping grounds once a project grows past a handful of files.
- Each feature owns its own slice: e.g. `features/orders/{routes,service,schema,tests}`.
- Shared code only goes in a top-level `shared/` or `common/` once it's actually used by 2+ features — don't pre-create it empty.
- Keep a flat depth where possible (max ~3-4 levels). If you need 6 levels to find a file, the structure is wrong.

## File size

- **Prefer no file over ~200 lines.** Not a hard limit — a signal. If a file is creeping past it, that's usually a sign it's doing more than one job.
- Split by responsibility, not arbitrarily by line count (don't chop a 250-line file into two 125-line files that still depend on each other for one thing).
- One export/concept per file where reasonable (one component, one route group, one service).

## Layering

- Keep a clear direction of dependency: routes/handlers → services → data access. Lower layers never import from higher ones.
- Business logic does not live in route handlers — handlers parse input, call a service, return a response.
- Data access (DB queries) stays behind a repository/service layer, never called directly from route handlers.

## Decisions to make explicit, early

- Monolith vs. modular monolith vs. services — default to a **modular monolith** unless there's a concrete reason (independent scaling, separate teams/deploy cadence) for splitting services.
- Sync vs. async boundaries (queues/background jobs) — decide per operation based on whether the caller needs to wait for the result.
- Where validation happens (edge, once) vs. where it's re-checked (trust boundaries only, not everywhere).

## Anti-patterns to avoid

- God files/modules that import everything.
- Circular dependencies between features — if two features need each other, the shared part belongs in `shared/`.
- Config and secrets scattered across files instead of one typed config module.