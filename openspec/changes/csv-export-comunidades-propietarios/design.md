# Design: CSV Export for Comunidades and Propietarios

## Technical Approach

Inline addition to `app/comunidades/page.tsx` and `app/propietarios/page.tsx`. Each page imports `generateCSV` and `downloadCSV` from `@/lib/csv/export`, defines a `handleExportCSV` handler inside the component, and adds a `Button` to the existing filter row after a new `flex-1` spacer. Reuses the `lib/csv/export.js` utility unchanged. Follows the same shape (handler + button) used by `components/recibos/receipt-workspace.tsx` and `components/deudores/debtor-workspace.tsx`, but lives inline because these two pages are monolithic (no filter/workspace component to extend).

## Architecture Decisions

### Decision: Inline handler in `page.tsx` instead of extracting a workspace component

**Choice**: Add `handleExportCSV` and JSX directly inside each page component.
**Alternatives considered**: Extract `ComunidadesWorkspace` and `PropietariosWorkspace` components first, then add the button inside the filter subcomponent (the pattern used by recibos/deudores).
**Rationale**: Proposal scope is "no new components". AGENTS.md forbids unsolicited refactors. The existing pages are self-contained and the change is small (~15 lines each). If a third export or filter grows, extraction is a clean future step.

### Decision: Insert a `flex-1` spacer before the export button

**Choice**: Add `<div className="flex-1" />` between the status `Select` and the new `Button` inside the existing `<div className="flex gap-4 items-center flex-wrap">` row.
**Alternatives considered**: `justify-end` on a wrapper, `ml-auto` on the button, or moving the button to its own row.
**Rationale**: Identical pattern to `debtor-filters.tsx` (line 88) and `receipt-filters.tsx` (line 167). The search input already has `flex-1`, so the spacer must be a separate empty div to push the button past the select.

### Decision: Include `Download` icon in the button

**Choice**: `<Button variant="outline"><Download className="w-4 h-4 mr-2" />Exportar CSV</Button>`.
**Alternatives considered**: Plain text label only (matches existing `debtor-filters` / `receipt-filters`).
**Rationale**: Per explicit user request. The existing buttons were authored before icon convention was standardized. The Button primitive already handles icon spacing via `has-data-[icon=inline-start]:pl-2`, and `lucide-react` is already a dependency. Marked as a small intentional deviation from the existing pattern (see Open Questions).

### Decision: Transform `hasPending` to human-readable label in Comunidades CSV

**Choice**: `Estado` column emits `"Pendiente"` or `"Al día"`, matching the table `Badge` labels.
**Alternatives considered**: Export raw boolean (`true` / `false`).
**Rationale**: CSV is for human consumption (Excel). The column header `Estado` implies a state, not a boolean. Mirrors how `debtor-workspace.tsx` maps `status` → `"Pagado" | "Pendiente" | "Reclamado" | "Judicial"`.

### Decision: Emit decimals with dot separator for monetary columns

**Choice**: `Deuda total (€)` exports `totalDebt` as `(cents / 100).toFixed(2)` (e.g. `1234.50`).
**Alternatives considered**: Reuse `formatCentsToEuros` which produces `1.234,50 €` (es-ES locale).
**Rationale**: Matches the existing convention in `debtor-workspace.tsx` (line 113–114). The header `(€)` documents the unit; dot decimals are standard for spreadsheet sorting/aggregation. Locale formatting is for the UI, not data interchange.

## Data Flow

```
User clicks "Exportar CSV"
        │
        ▼
handleExportCSV()
        │
        ├── headers: string[]       (Spanish column titles)
        ├── columns: string[]        (keys to extract from each row)
        ├── rows = filtered.map(...) (apply human-readable transforms)
        │
        ▼
generateCSV(headers, columns, rows)  →  CSV string with UTF-8 BOM
        │
        ▼
downloadCSV(csv, `comunidades-YYYY-MM-DD`)  →  browser Blob + anchor click
```

For `comunidades`, `rows` derives `estado` from `hasPending`. For `propietarios`, `rows` derives `deuda` and `recibos` directly from the already-computed `totalDebt` / `pendingCount` fields on `propietariosWithStats`.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `app/comunidades/page.tsx` | Modify | Add `Button` + `Download` imports, add `handleExportCSV` inside `ComunidadesPage`, add `flex-1` spacer and export button inside the filter row. |
| `app/propietarios/page.tsx` | Modify | Add `Button` + `Download` imports, add `handleExportCSV` inside `PropietariosPage`, add `flex-1` spacer and export button inside the filter row. |
| `lib/csv/export.js` | None | Reused as-is. |
| `data/*.ts` | None | Mock data already exposes all required computed fields (`ownerCount`, `pendingCount`, `hasPending`, `communityName`, `totalDebt`). |

## Interfaces / Contracts

No new types. Reuses existing `Community`, `Owner`, and inline augmented shapes from each page. The handler signature is identical between the two files:

```ts
const handleExportCSV = (): void => { ... }
```

Handler invocations from JSX: `onClick={handleExportCSV}`. No props, no state, no context.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | N/A | `strict_tdd: false`, no test runner installed. |
| Integration | N/A | Same. |
| E2E | N/A | Same. |
| Manual | Click button in each page with various filter combinations; open downloaded CSV in Excel and LibreOffice; verify BOM, Spanish headers, row count matches table, numeric columns sort correctly. | Per `openspec/config.yaml` `verify` rule. |

Verification command: `npx tsc --noEmit` (per proposal success criteria and `openspec/config.yaml` `quality.type_checker`).

## Migration / Rollout

No migration. Rollback: revert both `page.tsx` files. No shared state, no database, no schema.

## Open Questions

- **Icon vs. text-only button**: User requested a `Download` icon, but the existing `Exportar CSV` buttons in `debtor-filters.tsx` and `receipt-filters.tsx` are plain text. The design follows the user's explicit instruction. If consistency with existing pattern is preferred, drop the icon. The apply step should confirm before merging.
- **UTC date in filename**: `new Date().toISOString().split("T")[0]` returns UTC date. For Spanish evening users (UTC+1/+2) the file can be named with yesterday's date. Matches existing convention in `debtor-workspace` and `receipt-workspace`; fixing all three is out of scope.
- **Empty filtered set**: Both handlers run silently when `filteredComunidades` / `filteredPropietarios` is empty — the CSV will have a header row only. Matches the existing `recibos` / `deudores` behavior. Disabling the button when the result is empty is a UX nicety, not in scope.
