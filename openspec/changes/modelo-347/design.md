# Design: Modelo 347 — Declaración Anual de Operaciones con Terceros

## Technical Approach

Add a new fiscal report slice under `/informes/modelo-347` that mirrors the existing feature-folder pattern (`components/proveedores/`, `components/recibos/`): a thin server page imports mock data and hands it to a single client `Modelo347Workspace`, which owns year state, runs a pure `filterModelo347` aggregation, and renders a `Modelo347Filters` + `Modelo347Table` pair. Reuse `lib/csv/export.js` for the download — same pattern as `recibos` and `deudores` workspaces. The 3.001 € threshold is a named exported constant, not a magic number.

## Architecture Decisions

| Decision | Choice | Alternatives considered | Rationale |
|---|---|---|---|
| Aggregation site | Pure function `filterModelo347(expenses, providers, year)` in `lib/proveedores/filter-logic.js` | Inline in workspace, custom hook, server route | Same pattern as `filterExpenses` — pure, testable with `node:test`, no hydration cost. |
| Grouping key | `taxId` (CIF) across all `Provider` records, not `providerId` | Group by `providerId` | Real Modelo 347 reports by CIF, regardless of how many communities a provider serves. |
| Threshold source | Exported constant `MODELO_347_THRESHOLD_CENTS = 300_100` | Hard-coded, env var, config file | Risk in proposal: "Threshold is a configurable constant; adjustable without structural changes." Single named export satisfies that without introducing config. |
| Year source | `Select` derived from available expense years + current year | Static range 2023–next, calendar picker | Existing data spans 2023–2024; build the list from `GASTOS` so the dropdown never lists empty years. |
| Mock data | Add ≥2 providers sharing the same `taxId` across different `communityId` | Cross-community expense records | Required by success criterion "Multi-community CIF consolidation produces single row with correct totals." |
| Sidebar nav | Extend `NavSection` with optional `children`; add parent "Informes" containing "Modelo 347" | Flat top-level "Modelo 347" entry, separate routes | User explicitly asked for "under Informes"; nested rendering matches the new URL prefix. |
| Components colocated in `components/informes/modelo-347/` with `.module.css` per file | Inline styles only, no modules | Project convention established in `components/proveedores/`, `components/recibos/`, `components/deudores/`. |

## Data Flow

```
data/proveedores.ts (providers + expenses)
        │
        └─ app/informes/modelo-347/page.tsx (server)
                │
                └─ components/informes/modelo-347/modelo-347-workspace.tsx (client)
                        │  useState<year>
                        │  useMemo → filterModelo347(GASTOS, PROVEEDORES, year)
                        │           │ joins ProviderExpense → Provider via providerId
                        │           │ groups by taxId, sums amountCents in year
                        │           │ filters total > MODELO_347_THRESHOLD_CENTS
                        │           ▼
                        │     AnnualProviderSummary[]
                        │
                        ├─ modelo-347-filters.tsx ─ year Select, export button
                        └─ modelo-347-table.tsx   ─ CIF, razón social, total, nº facturas, comunidades
```

## File Changes

| File | Action | Description |
|---|---|---|
| `types/proveedores.ts` | Modify | Add `AnnualProviderSummary` interface (taxId, businessName, totalCents, invoiceCount, communityIds, year). |
| `lib/proveedores/filter-logic.js` | Modify | Export `MODELO_347_THRESHOLD_CENTS = 300_100` and `filterModelo347(expenses, providers, year)`. |
| `data/proveedores.ts` | Modify | Add 2–3 mock providers sharing CIFs across `com-001` / `com-002` / `com-003` plus expenses for them, with at least one crossing the 3.001 € threshold. |
| `data/navigation.ts` | Modify | Add `Informes` parent section with `children: [{ label: "Modelo 347", href: "/informes/modelo-347" }]`. |
| `components/layout/sidebar.tsx` | Modify | Render nested `children` of a `NavSection` with left-indent + smaller font when present. |
| `app/informes/modelo-347/page.tsx` | Create | Server page: `<MainContent title="Modelo 347"><Modelo347Workspace ... /></MainContent>`. |
| `components/informes/modelo-347/modelo-347-workspace.tsx` | Create | Client boundary: year state, threshold + summary derivation, CSV handler. |
| `components/informes/modelo-347/modelo-347-filters.tsx` | Create | Year `<Select>`, threshold info badge, "Exportar CSV" button. |
| `components/informes/modelo-347/modelo-347-table.tsx` | Create | Aggregated table; `communityIds` rendered as comma-separated community names; empty state. |
| `components/informes/modelo-347/*.module.css` | Create | Filter row, table density, badge styles — reuse CSS custom properties from `DESIGN.md`. |
| `tests/proveedores/filter-logic.test.mjs` | Modify | Add `describe("filterModelo347")` block: same-CIF consolidation, threshold cut, year boundary, empty result. |

## Interfaces / Contracts

```ts
// types/proveedores.ts
export interface AnnualProviderSummary {
  taxId: string;                 // CIF, grouping key
  businessName: string;          // from any provider in the group
  totalCents: number;            // sum of amountCents in the selected fiscal year
  invoiceCount: number;          // distinct ProviderExpense records counted
  communityIds: string[];        // unique communities served (drives multi-community cell)
  year: number;                  // fiscal year the summary belongs to
}

// lib/proveedores/filter-logic.js (named export)
export const MODELO_347_THRESHOLD_CENTS = 300_100;

// data/navigation.ts
export interface NavSection {
  label: string;
  href: string;
  children?: NavSection[];
}
```

`filterModelo347(expenses, providers, year)` returns `AnnualProviderSummary[]` sorted by `totalCents` descending, already filtered to `totalCents > MODELO_347_THRESHOLD_CENTS`.

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Pure logic | CIF consolidation, threshold, year boundary, empty result, inactive providers | Extend `tests/proveedores/filter-logic.test.mjs` with `node --test`. |
| Static safety | Type contracts, route imports, navigation shape | `npx tsc --noEmit`. |
| Lint | Next/ESLint rules | `npm run lint`. |
| Manual | Year switch updates table, CSV downloads UTF-8 BOM with Spanish headers, threshold hides rows, sidebar highlights `/informes/modelo-347` | Browser review against the 4 success criteria in `proposal.md`. |

## Migration / Rollout

No migration. Mock-only change. Rollback = delete `app/informes/modelo-347/`, `components/informes/modelo-347/`, revert `data/proveedores.ts`, `data/navigation.ts`, `components/layout/sidebar.tsx`, `types/proveedores.ts`, `lib/proveedores/filter-logic.js`, and `tests/proveedores/filter-logic.test.mjs`. No backend, no auth, no real customer data.

## Open Questions

- [ ] Should the year dropdown also surface 2025 even if mock data only has 2023–2024, so the empty state is visible early?
- [ ] When two providers share a `taxId`, whose `businessName` wins in the summary row — first alphabetical, first by `providerId`, or all distinct names joined? (Default: first by `providerId`.)
- [ ] Should the CSV include a footer line with `Total registros` and `Total importe (€)` like real AEAT exports, or stay strictly row-per-CIF?
