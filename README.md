# self-track-v4

A personal condition / behavior tracker rebuilt as a Vite + React + TypeScript web app.

The v4 goal is not to freeze a final visual design. It is to create a small, testable product skeleton whose UI can be restyled without touching domain or storage logic.

## Live surfaces

- **Interactive Mock:** https://tndd.github.io/self-track-v4/mock/
- **Rich Specification:** https://tndd.github.io/self-track-v4/spec/
- **Pages entrance:** https://tndd.github.io/self-track-v4/

The mock and specification are intentionally separate products. The mock exists to test interactions and information architecture. The specification records accepted product/domain/architecture decisions and must not be generated from the mock's implementation details.

## Repository layout

```text
mock/              Vite + React interactive mock
spec/              Markdown source of truth for the specification
scripts/           static specification / Pages builders
.github/workflows/ GitHub Pages deployment
```

## Source-of-truth hierarchy

1. `spec/` in this repository — authoritative v4 product, data and architecture decisions.
2. `mock/` in this repository — disposable interaction/visual prototype; useful evidence, not the specification.
3. `self-track-v3/mock/` — legacy interaction/information reference for Today / Calendar / navigation.
4. `self-track-v3/docs/` and `lib/domain/` — legacy domain rules, data semantics and analysis behavior.
5. `self-track-v3` rendered Flutter/Web implementation — **not a visual reference**. Existing implementation drift must not be copied into v4.

## Stack

- Vite
- React + TypeScript
- React Router
- CSS design tokens (no component styling coupled to storage/domain code)
- Playwright for browser QA
- `RepoStore` abstraction for a GitHub-backed canonical data store
- IndexedDB/Dexie reserved for cache/outbox when persistence work begins
- GitHub Pages for continuously deployed mock + HTML specification

## Development

```sh
npm install
npm run dev          # interactive mock
npm run build:spec   # HTML specification only
npm run build:pages  # complete Pages artifact
```

## Current phase

Specification + interactive mock only. GitHub persistence and statistical algorithms are specified but deliberately not wired into the mock yet.

## Privacy boundary

The application repository and the personal data repository are separate. Health/personal records must live in a private data repository; never commit real records into this source repository.
