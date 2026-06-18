# Design: Grupos de Reparto y Coeficientes

## Technical Approach

Additive data layer (`Owner.coeficiente` + new `DistributionGroup` type) plus read-only display panels on the existing community detail page. No calculation logic, no backend, no DB. Coefficients stored as integer per-mille (`‰`) to match Spanish escritura conventions and avoid floating-point error. Mock data lives in `data/`, separated from UI per the existing `components/<area>/` convention. Two new components are introduced in a fresh `components/comunidades/` folder so the community page can stay a thin server component.

## Architecture Decisions

| Decision | Choice | Alternatives considered | Rationale |
|---|---|---|---|
| Coefficient unit | Integer per-mille (`coeficiente: number`, e.g. `125` = 12,5 %) | Percentage float (0.125) | Matches Spanish escritura notation; avoids float precision; type-checker enforces integer-friendly arithmetic |
| `Owner` extension | Add field to existing `types/propietarios.ts` (single source of truth) | New `OwnerWithCoeficiente` wrapper | Only one Owner type in the codebase; extending in-place keeps consumers simple |
| New components folder | `components/comunidades/{coeficientes-table,grupos-reparto-panel}.tsx` | Co-locate inside `app/comunidades/[id]/` | Mirrors existing pattern (`components/recibos/*`, `components/proveedores/*`) and keeps `app/` thin |
| Expandable groups | `grupos-reparto-panel.tsx` is a **client component** (`"use client"` + `useState`); page stays server | Make the whole page client, or use a CSS-only `<details>` element | Localized state; page can still stream non-interactive data; matches the "fast and lightweight" design directive |
| `coeficientes-table.tsx` | Server component, takes `owners[]` and pre-sorts by `unitReference` | Client-side sort, fetch hook | Read-only display; server sort removes hydration cost; deterministic order |
| Validation function | `lib/comunidades/validate-coeficientes.ts`, pure function returning `{ isValid, actualSum, diff }` with default tolerance ±1‰ | Class-based, side-effecting, throwing on invalid | Pure + small surface; matches style of `lib/propietarios/debt-logic.js` |
| Sort key for `unitReference` | `localeCompare(b, undefined, { numeric: true })` | Plain `<` / `>` lexicographic | Future-proofs against "10ºA" appearing later; current data is all 1-5 floors so both work today |
| Coeficiente column in existing owner table | In-place edit of `app/comunidades/[id]/page.tsx` + new CSS class in existing `community-detail.module.css` | Extract table into a shared component | Scope is additive and small; old table uses CSS module, not shadcn, so extracting would be over-engineering |

## Data Flow

```
app/comunidades/[id]/page.tsx  (server, async)
  ├─ reads  COMUNIDADES, PROPIETARIOS, RECIBOS
  ├─ reads  GRUPOS_REPARTO  (NEW)         ──┐
  ├─ computes  validateCoeficientes(...)    │ mock data
  │                                          │
  └─ renders ──> <CoeficientesTable         │
                  owners={...} />           │
                <GruposRepartoPanel  ────────┘
                  groups={...}
                  ownerNames={...} />
                  (client; expands member list)
```

Coefficient column on the existing owner table is rendered directly inside `page.tsx` (no extraction) to keep the diff minimal.

## File Changes

| File | Action | Purpose |
|---|---|---|
| `types/propietarios.ts` | Modify | Add `coeficiente: number` to `Owner` |
| `types/grupos-reparto.ts` | Create | `DistributionGroup` interface |
| `data/propietarios.ts` | Modify | Add `coeficiente` to all 16 mock owners (per-mille, sum = 1000 per community ± 1) |
| `data/grupos-reparto.ts` | Create | 4 mock groups (2 in com-001, 1 in com-002, 1 in com-004) |
| `lib/comunidades/validate-coeficientes.ts` | Create | Pure validator (see Interfaces) |
| `components/comunidades/coeficientes-table.tsx` | Create | Server component; sorted by `unitReference`; shows Coeficiente ‰, % display, name, unit |
| `components/comunidades/grupos-reparto-panel.tsx` | Create | Client component; lists groups with member count, expandable to show owner names; falls back to "Reparto por coeficiente" when no group assigned to an expense context (model only) |
| `app/comunidades/[id]/page.tsx` | Modify | Add Coeficiente column to owner `<table>`; render `<CoeficientesTable>` and `<GruposRepartoPanel>` below it; run `validateCoeficientes` and surface a small non-blocking warning chip when sum != 1000 ± 1 |
| `app/comunidades/[id]/community-detail.module.css` | Modify | New class for the Coeficiente numeric cell (right-aligned, `tabular-nums`); section spacing for the two new panels |

## Interfaces / Contracts

```ts
// types/grupos-reparto.ts
export interface DistributionGroup {
  id: string;
  name: string;
  communityId: string;
  ownerIds: string[];
}

// lib/comunidades/validate-coeficientes.ts
export interface CoefficientValidationResult {
  isValid: boolean;
  actualSum: number;
  expected: number;   // 1000
  tolerance: number;  // default 1
  diff: number;       // |actualSum - expected|
}
export function validateCoeficientes(
  coeficientes: number[],
  options?: { expected?: number; tolerance?: number }
): CoefficientValidationResult;
```

Coeficientes table component contract: `{ owners: Owner[] }` — pre-sorts internally; renders an empty-state ("Sin propietarios") when array is empty. Grupos panel contract: `{ groups: DistributionGroup[]; ownerNames: Record<string, string> }` — looks up display names by id so the panel does not depend on the full `Owner` list.

## Testing Strategy

| Layer | What to test | Approach |
|---|---|---|
| Static | TS compilation | `npx tsc --noEmit` (existing project command) |
| Lint | Style | `npm run lint` |
| Manual | Sum-per-community = 1000 ± 1; rendering on `/comunidades/com-001`, `/com-002`, `/com-004`; group expand/collapse; empty-state for com-003 (no groups assigned) | Open each route in browser; expand a group; confirm chip appears only when sum drifts |
| Validator smoke | Pass `[]`, `[1000]`, `[500, 501]`, `[1000, 1]` | Console-check via temporary import or one-off `ts-node` — no test runner available per `openspec/config.yaml` |

No automated test runner is installed; the `testing` block in `openspec/config.yaml` is all `available: false`. Validation is manual review.

## Migration / Rollout

No migration. All changes are additive and confined to mock data + display. Rollback = revert the file list above (proposal already documents this).

## Open Questions

- [ ] Does the usuaria want the coeficiente column visible in the *existing* owner table **and** in a separate `CoeficientesTable`? The instructions ask for both, which is what this design does — flagging in case duplication is unintentional.
- [ ] Where (if anywhere) should the "Reparto por coeficiente (default)" hint be surfaced in the panel? Current design renders it as muted subhead text when the panel is open. No receipt calculation, per proposal scope.
- [ ] Group names in mock data: pick neutral Spanish labels ("Ascensor", "Limpieza portal", "Jardín", "Fachada")? Or wait for product validation? Defaulting to neutral labels; trivially editable in `data/grupos-reparto.ts`.
