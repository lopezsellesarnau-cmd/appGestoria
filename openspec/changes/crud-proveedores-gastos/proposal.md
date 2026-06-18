# Proposal: CRUD Proveedores y Gastos

## Intent

Enable create, update, and soft-delete for providers and expenses in the mock frontend. Current state is read-only — the gestoría needs to manage provider contact/bank details and register expenses against them with payment tracking.

## Scope

### In Scope
- Modal-based provider create/edit (Dialog) with expanded fields: address, phone, email, IBAN, notes
- Provider soft-delete via isActive toggle from listing table
- Modal-based expense create/edit (Dialog) from the provider mayor page: paymentDate, paymentMethod
- Expense delete with confirmation dialog
- Extensible category config object (5 defaults: cleaning, maintenance, insurance, utilities, administration)
- Totals recalculation after any mutation on the mayor page

### Out of Scope
- File upload (receiptUrl) — deferred until Supabase is wired
- Provider many-to-many across communities — communityId stays on Provider
- Backend persistence — all CRUD operates on in-memory mock arrays
- New categories beyond the 5 defaults in this change
- Auth, tax ID validation, or fiscal rules

## Capabilities

### New Capabilities
- `provider-crud`: Create, read, update, and soft-delete provider records. Supports address, phone, email, IBAN, and notes beyond the current minimal schema.
- `provider-expense-crud`: Create, read, update, and delete expenses linked to a provider. Tracks paymentDate and paymentMethod alongside existing financial fields.

### Modified Capabilities
- `provider-ledger`: Add "Nuevo gasto" button in header; edit/delete row actions via modals; totals recalculate after mutations.
- `provider-expenses-list`: Add provider edit/delete action column. Category filter works with extensible config.

## Approach

Modal-based CRUD via shadcn/ui Dialog on existing pages — no new routes. Provider CRUD on `/proveedores` (action column → Dialog). Expense CRUD on `/proveedores/[id]/mayor` (header button + row actions → Dialog). Reactive mock data layer emits updates; components re-render totals on mutation.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `types/proveedores.ts` | Modified | Expand Provider (address, phone, email, iban, notes) and ProviderExpense (paymentDate, paymentMethod) |
| `data/proveedores.ts` | Modified | Update 13 mock providers and ~45 expenses with new fields; add reactive wrapper |
| `components/proveedores/provider-table.tsx` | Modified | Add action column (edit/delete) |
| `components/proveedores/provider-ledger.tsx` | Modified | Add expense CRUD button, row actions, mutation-aware totals |
| `lib/proveedores/categories.ts` | New | Extensible category config object |
| `components/proveedores/ProviderForm.tsx` | New | Shared create/edit form (Dialog) |
| `components/proveedores/ExpenseForm.tsx` | New | Shared create/edit form (Dialog) |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Modal + filter state interaction causes stale UI | Medium | Centralized data layer emits updates; components re-apply active filters |
| Category union type breakage on extension | Medium | Replace union with string type backed by config object |
| Amount conversion bugs (cents ↔ euros) | Low | Isolated conversion utility with explicit contract |

## Rollback Plan

New components (ProviderForm, ExpenseForm, categories.ts) are additive — delete them. Modified components revert via git. Type changes are backwards-compatible (new fields optional in old UI). Restore `types/proveedores.ts` and `data/proveedores.ts` from prior commit if field expansion breaks existing views.

## Dependencies

- shadcn/ui Dialog (already installed)
- Existing mock data in `data/proveedores.ts` (13 providers, ~45 expenses)
- `lib/proveedores/filter-logic.js` for filter compatibility

## Success Criteria

- [ ] Provider create/edit Dialog opens from listing page and persists to mock data
- [ ] Provider soft-delete removes provider from active view
- [ ] Expense create/edit Dialog opens from mayor page and persists to mock data
- [ ] Expense delete with confirmation removes the row
- [ ] Mayor page totals and filtered list update after any mutation
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
