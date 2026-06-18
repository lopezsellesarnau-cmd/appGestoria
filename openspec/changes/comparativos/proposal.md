# Proposal: Comparativos Interanual de Gastos

## Intent

Enable per-community year-over-year expense comparison so gestores can detect cost trends and anomalies. Currently, `/comunidades/[id]` shows owners and debt but provides no expense analysis. A gestor reviewing community finances has no way to answer "are we spending more on maintenance this year?" without manual calculation.

## Scope

### In Scope
- New route `/comunidades/[id]/comparativos` with year selector (pair: A vs B)
- Summary metric cards: year totals, % change, biggest mover category
- Bar chart (side-by-side) comparing category spend Year A vs Year B via recharts
- Comparison table: category/provider breakdown with YoY change column
- Year selector dropdown and community context header
- **Provider expenses only** (`GASTOS` from `data/proveedores.ts`)

### Out of Scope
- Owner receipts (`RECIBOS`) comparison — different cash-flow domain
- Cross-community or global comparison
- PDF/Excel export
- Real financial reports (balance sheets, legally-mandated formats)
- Backend, database, auth, or real data

## Capabilities

### New Capabilities
- `provider-expense-comparison`: Per-community year-over-year expense comparison with category breakdown, summary metrics, bar chart, and comparison table using mock provider expense data

### Modified Capabilities
None — this is a new feature using existing data sources without changing existing spec requirements.

## Approach

Community-scoped nested route under `/comunidades/[id]/comparativos` following the existing pattern (`/propietarios/[id]/mayor`, `/proveedores/[id]/mayor`). All aggregation is pure computation over `ProviderExpense[]` filtered by community ID. recharts is loaded lazily via `next/dynamic` to avoid blocking the initial bundle. Mock data extension (`data/proveedores.ts` with 2023 and 2025 entries) is a hard prerequisite executed as the first task.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `data/proveedores.ts` | Extended | Add 2023 and 2025 mock expense records |
| `app/comunidades/[id]/comparativos/page.tsx` | New | Route entry: year selector + comparison view |
| `components/comparativos/` | New | Feature folder: chart, table, metrics, year-selector |
| `components/comunidades/` | Modified | Add nav link from community detail to `/comparativos` |
| `package.json` | Modified | Add `recharts` dependency |
| `types/proveedores.ts` | New | Aggregation utility types (year-grouped, category-grouped) |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| recharts increases bundle size | Low | `next/dynamic` with `ssr: false`; chart component loads only when route is visited |
| User expects receipt comparison in v1 | Medium | Clearly scope boundary documented; receipts are a separate cash-flow domain |
| Aggregation math looks authoritative when it's mock | Low | Add "Datos mock — pendiente validación real" label on comparison page |

## Rollback Plan

1. Remove `app/comunidades/[id]/comparativos/` directory
2. Remove `components/comparativos/` directory
3. Revert `package.json` recharts addition, run `npm install`
4. Revert nav link in community detail page
5. Mock data extension (`data/proveedores.ts` additions) is additive — can stay since it enriches existing provider list views

## Dependencies

- **Hard prerequisite**: Extend `data/proveedores.ts` with 2023 and 2025 mock expense records before any UI work begins
- `npm install recharts`

## Success Criteria

- [ ] Route `/comunidades/[id]/comparativos` renders for any community with mock data
- [ ] Year selector toggles between comparison year pairs and updates all views
- [ ] Bar chart renders category breakdown side-by-side for selected years
- [ ] Comparison table shows per-category/per-provider breakdown with YoY delta column
- [ ] `npx tsc --noEmit` passes; `npm run build` succeeds
- [ ] Empty state handled: community with no provider expenses shows clear message
