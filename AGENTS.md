# AGENTS.md

## Project intent
self-track-v4 is a Vite/React rewrite of self-track-v3. It is intentionally optimized for easy iteration and browser-visible QA.

## Artifact separation
- `spec/` is the authoritative specification source. Its Markdown is built into the rich HTML specification on GitHub Pages.
- `mock/` is an interactive, disposable prototype. It may explore ahead of the specification and may also lag behind the production app.
- Never make the specification mechanically depend on mock implementation details.
- Never treat mock markup/CSS as production architecture.
- When the real app overtakes the mock, update or replace the mock only when it remains useful; do not force parity merely to keep them visually synchronized.
- Pages exposes the two surfaces separately at `/spec/` and `/mock/`.

## Legacy source hierarchy
- v3 `mock/`: interaction/information reference only.
- v3 `docs/` + `lib/domain/`: behavior/data/analysis reference.
- v3 rendered Flutter/Web implementation: NOT a fidelity target.
- v4 `spec/`: authoritative when decisions differ.

## UI rule
Do not over-polish phase-1 UI. Preserve changeability. Keep domain and storage logic independent from presentation. Use CSS tokens rather than component-local hard-coded palette values.

## Persistence rule
Personal data belongs in a separate private data repository. Do not commit real health records here.

## Verification
For UI changes, use real browser interactions and inspect screenshots when browser tooling is available. Screenshot capture alone is not sufficient. For Pages changes, verify both `/mock/` and `/spec/` build into the Pages artifact independently.
