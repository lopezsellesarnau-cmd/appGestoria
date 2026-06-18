# Archive Report: comunidades-navigation

**Date**: 2026-06-10
**Archive Location**: `openspec/changes/archive/2026-06-10-comunidades-navigation/`
**Mode**: OpenSpec (filesystem)

## Summary

Fixed sidebar navigation with real routes and created three new pages for community and owner management. Removed dead sidebar entries. All pages are Server Components using CSS Modules with mock data from `data/`.

## Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Component architecture | Server Components (no `"use client"`) | Follows existing patterns; no interactivity needed yet |
| Styling approach | CSS Modules only | Matches project conventions; no CSS-in-JS overhead |
| Data layer | Mock data in `data/` | Prototype phase; keeps UI decoupled from data source |
| Debt calculation | Filter `status !== "paid"` | Includes `pending`, `claimed`, `judicial` as non-paid |
| Routing | Dynamic `[id]` params | Standard Next.js App Router pattern |

## Files Created

| File | Description |
|------|-------------|
| `app/propietarios/page.tsx` | Owner index — 16 owners with debt calculation |
| `app/propietarios/propietarios.module.css` | Owner index styles |
| `app/comunidades/page.tsx` | Community index — 4 communities |
| `app/comunidades/comunidades.module.css` | Community index styles |
| `app/comunidades/[id]/page.tsx` | Community detail — owners filtered by communityId |
| `app/comunidades/[id]/community-detail.module.css` | Community detail styles |

## Files Modified

| File | Change |
|------|--------|
| `data/navigation.ts` | Replaced `#` routes with real paths; removed 5 dead entries |

## Verification Results

| Check | Result |
|-------|--------|
| `npm run lint` | ✅ No ESLint warnings or errors |
| `npm run build` | ✅ 8 static pages, all routes present |
| Design coherence | ✅ All criteria met (Server Components, CSS Modules, mock data separation) |

## Build Output (8 pages)

```
Route (app)                              Size     First Load JS
┌ ○ /                                    216 B          87.5 kB
├ ○ /_not-found                          873 B          88.1 kB
├ ○ /comunidades                         346 B          96.3 kB
├ ƒ /comunidades/[id]                    480 B          96.5 kB
├ ○ /propietarios                        368 B          96.3 kB
├ ƒ /propietarios/[id]/mayor             611 B          96.6 kB
├ ○ /proveedores                         2.06 kB          98 kB
├ ƒ /proveedores/[id]/mayor              539 B          96.5 kB
└ ○ /recibos                             2.06 kB          98 kB
```

## Tasks Completed

| Task | Status |
|------|--------|
| Task 1: Owner index page (`/propietarios`) | ✅ |
| Task 2: Community detail (`/comunidades/[id]`) | ✅ |
| Task 3: Community index (`/comunidades`) | ✅ |
| Task 4: Fix sidebar with real routes | ✅ |

## Issues Found

**None** — all acceptance criteria met, no critical or minor issues.

## SDD Cycle: Complete ✅

This change has been fully planned, implemented, verified, and archived. Ready for the next change.
