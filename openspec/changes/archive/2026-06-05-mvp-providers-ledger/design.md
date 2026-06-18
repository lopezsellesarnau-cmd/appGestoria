# Design: MVP Providers Ledger

## Technical Approach

Build a mock-only provider expenses slice by copying the existing receipts pattern: a thin App Router page imports mock data, passes it into a single client workspace, and that workspace owns filter state plus derived filtered rows. The provider ledger route mirrors `app/propietarios/[id]/mayor/page.tsx`: resolve the route id from `params`, call `notFound()` for unknown providers, filter the shared mock expenses, then render a read-only ledger component. Styling stays in CSS Modules and reuses the table, filter, zebra, status-chip, and token conventions from `components/recibos/` and `DESIGN.md`.

## Architecture Decisions

| Decision | Choice | Alternatives considered | Rationale |
|---|---|---|---|
| Data source | Local `data/proveedores.ts` exports providers and expenses | Backend, Prisma, Supabase | The repo is prototype-only; mock data must remain separated from UI and disposable. |
| UI structure | New `components/proveedores/` parallel to `components/recibos/` | Generic shared table/filter components | Current code favors feature folders; abstraction now would exceed the slice and hide domain differences. |
| Status display | Create `expense-status-chip` | Reuse receipt `StatusChip` | Provider payment statuses are related but not the same domain; separate chip avoids coupling. |
| Filtering | Flat client state with empty-string/`all` sentinels and `useMemo` | URL search params, server filtering | Existing receipts implementation uses client state; no backend or shareable URLs required. |
| Ledger math | No totals, balances, thresholds, or 347 logic | Add summaries | Specs explicitly require discovery-safe consultation without fiscal/accounting claims. |

## Data Flow

```text
data/proveedores.ts + data/comunidades.ts
        │
        ├─ app/proveedores/page.tsx ──→ ProviderWorkspace ──→ ProviderFilters
        │                                      │
        │                                      └─ filtered expenses → ProviderTable
        │
        └─ app/proveedores/[id]/mayor/page.tsx ──→ ProviderLedger
```

The list page builds provider/community name maps inside the workspace, filters expenses by community, provider, category, payment status, and issue-date range, then renders an empty state when no rows match. The ledger page uses the same expense array filtered by `providerId`, preserving consistency between list and detail.

## File Changes

| File | Action | Description |
|---|---|---|
| `types/proveedores.ts` | Create | Provider, expense, category, and payment-status contracts. |
| `data/proveedores.ts` | Create | 10–15 mock providers and 30–50 mock expenses referencing existing community ids. |
| `components/proveedores/provider-workspace.tsx` + `.module.css` | Create | Client boundary, filter state, lookup maps, filtered derivation. |
| `components/proveedores/provider-filters.tsx` + `.module.css` | Create | Visible filters matching receipts controls. |
| `components/proveedores/provider-table.tsx` + `.module.css` | Create | Dense expenses table with provider links to `/proveedores/[id]/mayor`. |
| `components/proveedores/provider-ledger.tsx` + `.module.css` | Create | Provider context header, back link, expense history table, no-expenses state. |
| `components/proveedores/expense-status-chip.tsx` + `.module.css` | Create | Payment status labels/colors scoped to provider expenses. |
| `app/proveedores/page.tsx` | Create | Thin server page passing providers, expenses, and communities. |
| `app/proveedores/[id]/mayor/page.tsx` | Create | Dynamic ledger route following existing async `params` pattern. |
| `data/navigation.ts` | Modify | Change `Proveedores` from `#` to `/proveedores`. |

## Interfaces / Contracts

```ts
export type ProviderExpenseStatus = "paid" | "pending" | "overdue";
export type ProviderExpenseCategory =
  | "cleaning" | "maintenance" | "insurance" | "utilities" | "administration";

export interface Provider {
  id: string;
  businessName: string;
  taxId: string;
  communityId: string;
  isActive: boolean;
}

export interface ProviderExpense {
  id: string;
  providerId: string;
  communityId: string;
  issueDate: string;
  dueDate: string;
  concept: string;
  amountCents: number;
  paymentStatus: ProviderExpenseStatus;
  category: ProviderExpenseCategory;
  invoiceNumber?: string;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Static | Types, route imports, component props | `npx tsc --noEmit` |
| Quality | Next/ESLint rules | `npm run lint` |
| Build | App Router route compilation | `npm run build` if time allows |
| Manual | `/proveedores` filters, empty state, provider drill-down, invalid id 404 | Browser review against spec scenarios |

## Migration / Rollout

No migration required. This is mock-only frontend code with no persistence, auth, external services, or real customer data.

## Open Questions

- [ ] Should the provider ledger header show all referenced communities or only the provider's primary community? The spec allows relevant community context; implementation can show unique community names from expenses.
- [ ] Are `overdue` and mock categories acceptable Spanish-domain labels for discovery, or should wording be reviewed with the user before implementation?
