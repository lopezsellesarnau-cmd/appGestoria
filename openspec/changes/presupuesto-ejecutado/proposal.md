# Proposal: Presupuesto vs Ejecutado

## Intent

Provide a per-community budget-vs-actual comparison by chapter so the gestor can assess financial adherence. The MVP lists this as Phase 2 deliverable, and the app currently has no budget visibility.

## Scope

### In Scope
- Budget vs actual table inside `/comunidades/[id]` via underlined tab system (matching DESIGN.md)
- Mock-static annual budget per community (no edit form)
- Live aggregation of GASTOS by category to compute actual spending
- Variance display: absolute (€) and percentage, with green/amber/red badges
- Chapter taxonomy aligned with existing `ProviderExpenseCategory`

### Out of Scope
- Budget editing or creation forms
- Cross-community aggregated budget view
- Multi-year or quarterly budget periods
- Coefficient-based owner allocation (prorrateo)
- Export or print

## Capabilities

### New Capabilities
- `budget-vs-actual`: Per-community budget table with chapter-level planned vs. actual amounts and variance indicators.

### Modified Capabilities
- None

## Approach

**Tab integration inside community detail**: Convert `/comunidades/[id]/page.tsx` to use the underlined tab component from DESIGN.md (Gastos | Ingresos | Presupuesto). The Presupuesto tab renders a server component that loads mock budget data and live-aggregates GASTOS by matching `category` → budget chapter.

Mock budget lives in `data/presupuesto.ts` with `BudgetLine[]` per community per year. Variance is pure derived data — no duplication of expense amounts.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `app/comunidades/[id]/page.tsx` | Modified | Add tab system |
| `app/comunidades/[id]/` | Modified | New Presupuesto tab content |
| `types/presupuesto.ts` | New | BudgetLine, CommunityBudget types |
| `data/presupuesto.ts` | New | Mock budget data per community |
| `components/presupuesto/` | New | BudgetTable, BudgetSummary |
| `DESIGN.md` | Reference | Tab system already specified |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Tab refactoring breaks server component patterns | Low | Client component only for tab state; budget table stays server-rendered |
| Category vs chapter mapping gaps | Low | 1:1 alignment with existing ProviderExpenseCategory |
| Year-boundary edge cases | Low | Phase 2 uses single fixed year; no boundary logic needed |

## Rollback Plan

Remove the Presupuesto tab component and revert `page.tsx` to pre-tab layout. The mock data file can remain without side effects.

## Dependencies

- Existing GASTOS and ProviderExpenseCategory types
- DESIGN.md tab component specification

## Success Criteria

- [ ] Presupuesto tab visible in community detail with underlined tab style
- [ ] Budget table shows chapters with planned, actual, difference (€ and %)
- [ ] Actual amounts derived live from GASTOS, not duplicated
- [ ] Color badges indicate under/over budget status
- [ ] TypeScript compiles clean (`npx tsc --noEmit`)
