# Architecture

## 1. Layering

```text
UI / features
    ↓ domain-facing repositories only
self-track domain
    ↓
SelfTrackRepository
    ↓
RepoStore + optional LocalReplica
    ↓
GitHub repository (canonical files)
```

Dependencies point downward. GitHub details must not appear in React feature components.

## 2. Directory boundaries

```text
src/
  app/          routing and application composition
  components/   reusable presentation components
  domain/       models and pure algorithms
  data/         storage interfaces/adapters/sync boundary
  features/     screen-level UI and feature state
  fixtures/     mock-only data
  styles/       global tokens and skin
```

A future redesign should mostly replace `components/`, `features/*/*.css`, and token values. It should not require rewriting `domain/` or `data/`.

## 3. RepoStore: narrow generic layer

RepoStore is **not a database abstraction**. It is a versioned document/event-store adapter for small personal datasets.

Required shape:

```ts
export interface RepoStore {
  readText(path: string): Promise<RepoDocument | null>;
  list(path: string): Promise<RepoEntry[]>;
  writeText(input: RepoWrite): Promise<RepoDocument>;
  delete(path: string, expectedVersion: string): Promise<void>;
}
```

`expectedVersion` maps naturally to a Git blob/content SHA and makes conflicts explicit.

Not in scope:
- arbitrary queries
- joins
- transactions across many records
- high-frequency writes
- multi-user row locking

## 4. Canonical data layout (proposal)

Use a separate **private** repository for personal records.

```text
schema/
  version.json
catalog/
  tags.json
events/
  2026/
    08/
      2026-08-12.jsonl
      2026-08-13.jsonl
```

Daily JSONL keeps append-oriented event history small, human-readable and friendly to Git diffs. Tags/settings are ordinary versioned documents.

## 5. Local replica / offline path

Do not make network success a prerequisite for pressing “save”. When persistence work begins:

1. write the record to a local IndexedDB outbox;
2. update UI optimistically;
3. batch/serialize GitHub writes;
4. use remote version/SHA for conflict detection;
5. pull remote changes on startup/focus and reconcile.

GitHub remains canonical; IndexedDB is a cache/outbox, not the durable source of truth.

## 6. Authentication boundary

A browser token must never be hard-coded in source. The mock has no authentication. The production auth mechanism is a separate decision because it determines whether direct GitHub API access or a thin trusted proxy is appropriate.

## 7. Why Vite here

self-track is primarily an interactive personal SPA/PWA. SSR/SEO/server-component machinery is not a current requirement. Reusing the existing Vite/React/TypeScript conventions reduces architecture choices and shortens browser QA loops.
