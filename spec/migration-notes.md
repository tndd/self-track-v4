# v3 → v4 Migration Notes

## Preserve
- sparse/exception-based logging philosophy
- condition score semantics
- tags + archived history semantics
- 12-hour return-to-normal rule
- daily AUC model
- event-locked average
- Fisher/odds-ratio/lift phase-1 analysis
- Today / Calendar / Analysis / Tags / Settings information architecture
- valid interaction ideas from `mock/`

## Do not preserve blindly
- Flutter widgets and layout implementation
- Drift/Riverpod coupling
- v3 rendered HTML/Web behavior
- device-only persistence assumptions
- any visual mismatch created by the old implementation

## Rebuild order
1. specification + fixture-driven mock
2. domain algorithms ported to pure TypeScript with v3 test vectors
3. SelfTrackRepository over local fixtures
4. RepoStore GitHub adapter + local outbox
5. v3 data export/migration path
6. final visual redesign and PWA polish
