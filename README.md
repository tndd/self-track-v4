# self-track-v4

A personal condition / behavior tracker rebuilt as a Vite + React + TypeScript web app.

## Live surfaces

- **App:** https://tndd.github.io/self-track-v4/app/
- **Interactive Mock:** https://tndd.github.io/self-track-v4/mock/
- **Rich Specification:** https://tndd.github.io/self-track-v4/spec/
- **Pages entrance:** https://tndd.github.io/self-track-v4/

The production app, mock and specification are intentionally separate surfaces. `app/` is the daily-usable local product. `mock/` remains disposable interaction/reference material. `spec/` records accepted product/domain/architecture decisions.

## v4.0 scope

v4.0 is deliberately small enough to finish and use:

- Today: condition + tags + comment, persisted to IndexedDB
- Calendar/history: browse records by month/day
- Tags: create and archive/restore reusable tags
- Settings: local storage status, JSON export/import, destructive reset
- no fixture health records in the production app

GitHub canonical sync/auth/conflict reconciliation and statistical analysis are deferred to v4.1+ so they do not block daily use.

## Repository layout

```text
app/               production daily-use app
mock/              Vite + React interactive mock
spec/              Markdown source of truth for specification
scripts/           static specification / Pages builders
.github/workflows/ verification + GitHub Pages deployment
```

## Source-of-truth hierarchy

1. `spec/` — authoritative product, data and architecture decisions.
2. `app/` — current production implementation.
3. `mock/` — disposable interaction/visual prototype; useful evidence, not the specification.
4. `self-track-v3/mock/` — legacy interaction/information reference.
5. `self-track-v3/docs/` and `lib/domain/` — legacy domain rules, data semantics and analysis behavior.

## Development

```sh
npm install
npm run dev          # production app
npm run dev:mock     # interactive mock
npm run typecheck
npm test
npm run build:pages  # app + mock + specification Pages artifact
```

## Persistence and privacy

v4.0 stores personal records only in the browser's IndexedDB. Use Settings → JSON export for portable backups. The JSON is intentionally human-readable and app-independent.

Real health/personal records must never be committed to this source repository. A separate private GitHub data repository remains the planned canonical remote store for v4.1+.
