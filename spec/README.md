# Specification source

`spec/` is the authoritative, human- and agent-readable source for self-track-v4 decisions.

The files in this directory are deployed as a richer HTML documentation surface, but Markdown remains the editable source of truth. The HTML output is generated and must not be edited directly.

## Relationship to the mock

The interactive mock lives separately under `mock/`.

- The **specification** says what behavior, semantics, boundaries, and accepted product decisions mean.
- The **mock** is a cheap instrument for trying interaction and information-architecture ideas.
- A mock experiment does not become a requirement merely because it exists.
- The real application is allowed to overtake or replace the mock without creating a migration obligation back into the mock.

This separation is deliberate: it prevents a prototype from slowly becoming an accidental second implementation that must be kept in lockstep with production.
