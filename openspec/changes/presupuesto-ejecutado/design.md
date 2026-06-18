# Design: Presupuesto vs Ejecutado

## Technical Approach

Convert `app/comunidades/[id]/page.tsx` to render an underlined tab system (Propietarios | Gastos | Presupuesto) per DESIGN.md. The Presupuesto tab is a client component that receives the community's `GASTOS` as a prop and aggregates them by `category` against mock budget lines. Tab state lives in a single small client wrapper; per-tab content stays server-rendered where possible. No new dependencies, no DB.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|---|---|---|---|
| Tab state | Client `useState` in page-level wrapper | URL search param; server-only re-render | Simplest, no router coupling; matches proposal "client component only for tab state". |
| Year selector | Client `useState` in `presupuesto-tab.tsx` | URL `?year=…` | Year is tab-local UI; not shareable yet (out of scope: cross-year navigation). |
| Budget aggregation | Live aggregation in server component (sum `amountCents` of `GASTOS` by `category` and year) | Snapshot/duplicate of expenses | Proposal explicitly forbids duplicating expense amounts. |
| Category taxonomy | Reuse `ProviderExpenseCategory` 1:1 | New `BudgetChapter` type | Chapter alignment per proposal; one map in `types/presupuesto.ts` for labels. |
| Component path | `components/comunidades/presupuesto/` (per user prompt) | `components/presupuesto/` (proposal default) | User-specified path overrides proposal default. |
| Data shape | `PRESUPUESTOS: CommunityBudget[]` keyed by `(communityId, year)` | Nested map | Same flat-array style as existing `data/*.ts` mock stores. |
| Currency unit | `amountCents: number` | `amountEuros: number` | Consistency with `ProviderExpense.amountCents`. |
| Variance status | Three buckets: `under` (≤90% used), `on-track` (90–110%), `over` (>110%) | Custom threshold per category | Simple, deterministic, easy to badge with existing `Badge` variants. |

## Data Flow

```
page.tsx (RSC)
   ├─ loads COMUNIDADES, PROPIETARIOS, RECIBOS, GASTOS, PRESUPUESTOS
   ├─ filters GASTOS by communityId
   └─ <CommunityTabs /> (client)
         ├─ tab === "propietarios"  → <OwnersList owners={…} />  (RSC child)
         ├─ tab === "gastos"        → <CommunityExpenses expenses={…} />  (RSC child)
         └─ tab === "presupuesto"   → <PresupuestoTab
                                          communityId={id}
                                          expenses={communityGastos}
                                          budgets={communityBudgets} />  (client)
                                          ├─ year selector (local state)
                                          ├─ <PresupuestoSummary lines={derivedRows} />
                                          └─ <PresupuestoTable rows={derivedRows} />
```

`derivedRows` is a `BudgetRow[]` computed once per render by `lib/presupuesto/aggregate.ts`: joins `CommunityBudget` lines with the sum of `GASTOS` matching `(communityId, year, category)`.

## File Changes

| File | Action | Description |
|---|---|---|
| `app/comunidades/[id]/page.tsx` | Modify | Keep server; pass GASTOS + PRESUPUESTOS to a new client tabs wrapper. Move the Propietarios table into `components/comunidades/owners-list.tsx`. |
| `app/comunidades/[id]/community-detail.module.css` | Modify | Add `.tabsBar`, `.tab`, `.tabActive` classes for the underlined style. |
| `components/comunidades/community-tabs.tsx` | Create | Client. Renders the three tab buttons + active panel. State: `active: "propietarios" \| "gastos" \| "presupuesto"`. |
| `components/comunidades/owners-list.tsx` | Create | RSC. The current owners table, extracted. |
| `components/comunidades/community-expenses.tsx` | Create | RSC. Lightweight table of `GASTOS` filtered by `communityId` (mirrors provider-ledger markup, no filters). |
| `components/comunidades/presupuesto/presupuesto-tab.tsx` | Create | Client. Year selector (defaults to current year), aggregates rows, renders Summary + Table. |
| `components/comunidades/presupuesto/presupuesto-summary.tsx` | Create | RSC. Three KPI tiles using existing `Card` from `components/ui/card.tsx`. |
| `components/comunidades/presupuesto/presupuesto-table.tsx` | Create | RSC. Chapter table (Categoría · Presupuestado · Ejecutado · Diferencia · %). |
| `components/comunidades/presupuesto/presupuesto.module.css` | Create | Table + summary styles; reuse tokens (no Tailwind per existing community-detail pattern). |
| `types/presupuesto.ts` | Create | `BudgetLine`, `CommunityBudget`, `BudgetRow`, `VarianceStatus`. |
| `data/presupuesto.ts` | Create | `PRESUPUESTOS: CommunityBudget[]`. One entry per `(community, year, category)` covering `2023` and `2024` for `com-001…com-004` across all 5 `ProviderExpenseCategory` values. |
| `lib/presupuesto/aggregate.ts` | Create | Pure `aggregate(rows, expenses, year) → BudgetRow[]` (extracted for testability, mirrors `lib/proveedores/filter-logic.js`). |

## Interfaces / Contracts

```ts
// types/presupuesto.ts
import { ProviderExpenseCategory } from "./proveedores";

export interface BudgetLine {
  category: ProviderExpenseCategory;
  plannedCents: number;
}

export interface CommunityBudget {
  communityId: string;
  year: number;
  lines: BudgetLine[];
}

export type VarianceStatus = "under" | "on-track" | "over";

export interface BudgetRow {
  category: ProviderExpenseCategory;
  plannedCents: number;
  actualCents: number;
  diffCents: number;
  diffPct: number;       // actual / planned * 100
  status: VarianceStatus;
}
```

## Testing Strategy

Manual only (per `openspec/config.yaml`: no test runner). Verification steps in `sdd-verify`:

1. `npx tsc --noEmit` passes.
2. `npm run build` passes.
3. Open `/comunidades/com-001` → tabs render with Emerald Green 2px underline on the active tab.
4. Switch to **Presupuesto** → year defaults to 2024; switch to 2023 → rows update.
5. **Summary** card shows three figures: `Presupuestado`, `Ejecutado`, `Diferencia`.
6. At least one row per `com-001` shows red badge (over) and at least one green (under), proving live aggregation.

## Migration / Rollout

No migration. Rollback: remove `CommunityTabs` and the three components; restore `page.tsx` to the single-section layout. `data/presupuesto.ts` can stay without side effects.

## Open Questions

- [ ] Should the Gastos tab use the same filter UX as `provider-ledger`? Out of MVP scope; current plan is a simple list.
- [ ] Confirm with the user which year (2024 vs 2023) is the default for the year selector. Plan: default = `new Date().getFullYear()`.
