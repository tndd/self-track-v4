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
- GitHub-backed files are the canonical durable representation.
- UI technology is disposable.
- Domain data must remain readable without running self-track.

### 2.3 Analysis is event-centered
- Primary question: “what tends to happen before/after X?”
- Medication/action events, symptoms, meals, sleep and other tags should be alignable on a shared timeline.
- Event-locked averages remain a first-class analysis primitive.

### 2.4 Visual design is intentionally replaceable
- v4 phase 1 does not attempt final styling.
- Layout semantics, interaction states and information hierarchy matter more than exact pixels.
- All semantic colors, spacing, radii and typography are defined through tokens.
- Feature components may not import GitHub/network concerns.

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
- Tag selection can expand without navigating away.
- Selected tags and comment remain visible before commit.
- Record edit/delete is available from an intentional secondary gesture/menu, not accidental single tap.

### Calendar
- Month overview with one compact daily condition indicator.
- Month navigation.
- Summary/trend area below the month grid.
- Exact calendar decoration is not frozen in phase 1; v3 mock establishes the information hierarchy.

### Analysis
Phase-1 information architecture:
- recent condition trend
- event-locked analysis centered on a selected tag/action
- action × symptom associations
- explicit insufficient-data states

### Tags
- group-aware list
- create/edit
- archive/unarchive, never destructive deletion of referenced historical tags

### Settings
Phase 1 keeps only storage/status controls and destructive reset affordance. Sync implementation is later work.

## 5. Domain rules preserved from v3

- Condition domain value is `-2..2`; UI labels map to 1..5.
- When gaps exceed 12 hours, analysis/visualization inserts a virtual return-to-normal point 12 hours after the last observation.
- Daily score is based on trapezoidal integration, not the visual spline.
- Event-locked average is the primary continuous-outcome analysis.
- Odds ratio + Fisher exact test + lift remain the phase-1 discrete association tools.

## 6. Phase-1 completion boundary

This repository phase is complete when:
- architecture and source-of-truth rules are documented;
- a Vite/React skeleton exists for all five screens;
- Today and Calendar are interactable enough to validate flow;
- UI styling is tokenized and easy to replace;
- the mock runs entirely on fixtures;
- no real GitHub credentials or personal data are required;
- RepoStore contracts are defined without prematurely implementing a universal database framework.
