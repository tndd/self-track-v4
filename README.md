# self-track-v4

A personal condition / behavior tracker rebuilt as a Vite + React + TypeScript web app.

The v4 goal is not to freeze a final visual design. It is to create a small, testable product skeleton whose UI can be restyled without touching domain or storage logic.

## Source-of-truth hierarchy

1. `self-track-v3/mock/` — interaction and information-architecture reference for Today / Calendar / navigation.
2. `self-track-v3/docs/` and `lib/domain/` — domain rules, data semantics, and analysis behavior.
3. `self-track-v3` rendered Flutter/Web implementation — **not a visual reference**. Existing implementation drift must not be copied into v4.
4. `docs/` in this repository — v4 decisions override v3 where they conflict.

## Stack

- Vite
- React + TypeScript
- React Router
- CSS design tokens (no component styling coupled to storage/domain code)
- Playwright for browser QA
- `RepoStore` abstraction for a GitHub-backed canonical data store
- IndexedDB/Dexie reserved for cache/outbox when persistence work begins

## Current phase

Specification + interactive mock only. GitHub persistence and statistical algorithms are specified but deliberately not wired into the mock yet.

## Privacy boundary

The application repository and the personal data repository are separate. Health/personal records must live in a private data repository; never commit real records into this source repository.
