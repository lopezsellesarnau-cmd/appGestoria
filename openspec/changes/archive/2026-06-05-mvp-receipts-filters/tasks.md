# Tasks: MVP Receipts + Filters

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~1100–1350 |
| 400-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Full MVP slice | PR 1 | All files; mock-only, self-contained |

## Phase 1: Types and Mock Data

- [x] 1.1 Create `types/comunidades.ts` with `Community` interface (id, name, municipality)
- [x] 1.2 Create `types/propietarios.ts` with `Owner` interface (id, displayName, unitReference, communityId)
- [x] 1.3 Create `types/recibos.ts` with `ReceiptType`, `ReceiptStatus`, and `Receipt` interface
- [x] 1.4 Create `data/comunidades.ts` with 3–5 community mocks
- [x] 1.5 Create `data/propietarios.ts` with 10–15 owner mocks
- [x] 1.6 Create `data/recibos.ts` with 30–50 receipt mocks covering all types, statuses, communities, and owners

## Phase 2: Shared UI Components

- [x] 2.1 Create `components/recibos/status-chip.tsx` with semantic badge styling for paid/pending/claimed/judicial
- [x] 2.2 Create `components/recibos/status-chip.module.css` using global CSS variables and DESIGN.md density tokens

## Phase 3: Receipt Workspace Components

- [x] 3.1 Create `components/recibos/receipt-filters.tsx` with visible controls for type, community, owner, date range, and status
- [x] 3.2 Create `components/recibos/receipt-filters.module.css` with filter layout styles
- [x] 3.3 Create `components/recibos/receipt-table.tsx` with dense table rendering owner links, status chips, and empty state
- [x] 3.4 Create `components/recibos/receipt-table.module.css` with dense ERP table styles
- [x] 3.5 Create `components/recibos/receipt-workspace.tsx` as `'use client'` component owning filter state and filtered result derivation
- [x] 3.6 Create `components/recibos/receipt-workspace.module.css` with workspace layout styles

## Phase 4: Owner Ledger Components

- [x] 4.1 Create `components/recibos/owner-ledger.tsx` with read-only consolidated owner receipt table and context header
- [x] 4.2 Create `components/recibos/owner-ledger.module.css` with ledger-specific styles

## Phase 5: Route Pages

- [x] 5.1 Create `app/recibos/page.tsx` importing mock data and rendering ReceiptWorkspace inside MainContent
- [x] 5.2 Create `app/propietarios/[id]/mayor/page.tsx` resolving owner by id, deriving receipts, using notFound() for invalid owners
- [x] 5.3 Modify `data/navigation.ts` to change Recibos href from `#` to `/recibos`

## Phase 6: Verification

- [x] 6.1 Run `npx tsc --noEmit` to verify type contracts and route imports
- [ ] 6.2 Manual browser review: `/recibos` renders 30+ receipts, filters work independently and combined
- [ ] 6.3 Manual browser review: empty filter state shows explicit empty state
- [ ] 6.4 Manual browser review: owner link navigates to `/propietarios/[id]/mayor` with correct owner data
- [ ] 6.5 Manual browser review: invalid owner id triggers notFound()

## Phase 7: Verification-Base Fixes

- [x] 7.1 Add minimal ESLint setup (`.eslintrc.json` + `eslint` + `eslint-config-next@^14.2`) so `npm run lint` works
- [x] 7.2 Verify `npm run lint` and `npx tsc --noEmit` both pass in clean sequential run
- [x] 7.3 Add `prop-016` (Rosa Molina, 4ºA, com-004) as valid owner with zero receipts mock