# UI Contract

## 1. Reference policy

- `self-track-v3/mock/track.html`, `calendar.html`, and `menu.png` are valid references for information hierarchy and intended interactions.
- They are **not** a frozen final visual design for v4.
- The non-mock v3 HTML/Flutter rendering is not a reference and must not be copied to “match” screenshots.

## 2. Changeability is a requirement

The UI must support later redesign without touching domain/storage logic.

Rules:
- no hex colors inside feature components;
- no layout magic numbers in TS/TSX when CSS can own them;
- semantic CSS variables (`--surface`, `--condition-bad`, etc.);
- status/tag primitives are reusable components;
- page-specific CSS may compose primitives but not redefine storage/domain types;
- responsive breakpoints belong to styles, not data logic.

## 3. Phase-1 visual target

The first skin should be deliberately quiet and minimal:
- light neutral background
- compact mobile-first content column
- clear 5-state condition scale
- chips for tags
- bottom composer on Today
- drawer/sidebar navigation

Exact shadows, radii, fonts and decorative details are non-blocking. Obvious broken layout, clipped controls, inaccessible tap targets and confusing state transitions are blocking.

## 4. Today interaction states

Required states adapted from the v3 mock:
1. timeline idle
2. composer options open
3. tags expanded
4. large tag picker
5. selected tags/comment visible before save

The implementation may simplify presentation as long as these states remain reachable without navigation churn.

## 5. Browser QA contract

For every major UI change:
- run the app at phone and desktop widths;
- navigate using real controls;
- exercise Today composer expansion/tag selection/save path;
- capture screenshots of major states;
- actually inspect screenshots for overflow, accidental density, hierarchy and broken controls;
- use DOM/computed-style inspection only after a visible problem is found.

Pixel parity with v3 mocks is **not** a phase-1 acceptance criterion.
