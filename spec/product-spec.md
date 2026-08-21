# self-track-v4 Product Specification

## 1. Purpose

self-track records sparse, exceptional changes in physical/mental condition and the actions or circumstances around them, then helps discover time-lagged relationships.

The product is optimized for one person, low data volume, and long-lived history. It is not a clinical system, multi-user SaaS, or high-frequency telemetry platform.

## 2. Product principles

### 2.1 Exceptional logging, not continuous homework
- Normal state may be omitted.
- A missing condition entry is interpreted according to the decay model, not as an unknown questionnaire response.
- Logging must be fast enough to use when the user feels bad.

### 2.2 Data outlives the app
- Domain data must remain readable without running self-track.
- v4.0 persists daily-use data in IndexedDB and provides human-readable JSON export/import so the application can be useful before remote sync exists.
- A separate private GitHub-backed data repository remains the target canonical remote representation for v4.1+; remote authentication, reconciliation and sync must not block v4.0 daily use.
- UI technology is disposable.

### 2.3 Analysis is event-centered
- Primary question: “what tends to happen before/after X?”
- Medication/action events, symptoms, meals, sleep and other tags should be alignable on a shared timeline.
- Event-locked averages remain a first-class analysis primitive.

### 2.4 Visual design is intentionally replaceable
- v4.0 does not attempt final styling.
- Layout semantics, interaction states and information hierarchy matter more than exact pixels.
- All semantic colors, spacing, radii and typography should remain replaceable without rewriting persistence/domain behavior.

## 3. Canonical concepts

### Record
A point-in-time observation containing:
- id
- timestamp
- condition value (`-2..2` domain value; UI may show `1..5`)
- optional comment
- zero or more tag references

### Tag
A reusable label with:
- id
- name
- group / role
- archived state
- optional presentation metadata

Suggested semantic roles retained from v3:
- action
- symptom
- event
- condition (condition itself remains the record score rather than a normal tag)

### Tag occurrence
A tag attached to a record. Keep a numeric `value` field in the schema even when the first UI uses `1.0`, because dose/intensity is a natural future requirement.

## 4. Core screens

### Today
- Current-day timeline.
- Fast composer anchored near the bottom on small screens.
- Condition defaults to normal.
- `+` exposes condition + tag selection.
- Selected tags and comment remain visible before commit.
- Record deletion is available only through an intentional secondary control and confirmation.

### Calendar
- Month overview with one compact daily condition indicator.
- Month navigation.
- Selecting a day exposes its records.
- Statistical summary/trend visualization is later analysis work and does not block v4.0.

### Analysis
Deferred to v4.1+.

Planned primitives remain:
- recent condition trend
- event-locked analysis centered on a selected tag/action
- action × symptom associations
- explicit insufficient-data states

### Tags
- group-aware list
- create/edit
- archive/unarchive, never destructive deletion of referenced historical tags

### Settings
v4.0 includes:
- local storage/status information
- JSON export/import
- destructive local reset with confirmation

Remote sync controls appear only when the sync implementation exists.

## 5. Domain rules preserved from v3

These rules remain requirements for the later analysis implementation; they do not block the v4.0 logging release:

- Condition domain value is `-2..2`; UI labels map to 1..5.
- When gaps exceed 12 hours, analysis/visualization inserts a virtual return-to-normal point 12 hours after the last observation.
- Daily score is based on trapezoidal integration, not the visual spline.
- Event-locked average is the primary continuous-outcome analysis.
- Odds ratio + Fisher exact test + lift remain the discrete association tools.

## 6. v4.0 completion boundary

v4.0 is complete when the production app can be used independently of the mock to:
- record condition, tags and an optional comment using the real local date/time;
- persist records and tags in IndexedDB across reloads;
- browse historical records by month/day;
- create/edit and archive/restore tags;
- intentionally delete records;
- export and restore the complete local dataset as human-readable JSON;
- destructively reset local data with confirmation;
- build and deploy alongside the separate mock and specification surfaces.

Explicitly not required for v4.0:
- GitHub authentication, canonical remote sync and conflict reconciliation;
- statistical / event-locked analysis;
- final visual design or PWA polish.

The purpose of this boundary is to make “daily usable” a finished product state rather than treating production usefulness as something that only arrives after the remote-sync and analysis architecture is complete.
