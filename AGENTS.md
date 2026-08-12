# AGENTS.md

## Project intent
self-track-v4 is a Vite/React rewrite of self-track-v3. It is intentionally optimized for easy iteration and browser-visible QA.

## Source hierarchy
- v3 `mock/`: interaction/information reference.
- v3 `docs/` + `lib/domain/`: behavior/data/analysis reference.
- v3 rendered Flutter/Web implementation: NOT a fidelity target.
- v4 `docs/`: authoritative when decisions differ.

## UI rule
Do not over-polish phase-1 UI. Preserve changeability. Keep domain and storage logic independent from presentation. Use CSS tokens rather than component-local hard-coded palette values.

## Persistence rule
Personal data belongs in a separate private data repository. Do not commit real health records here.

## Verification
For UI changes, use real browser interactions and inspect screenshots. Screenshot capture alone is not sufficient.
