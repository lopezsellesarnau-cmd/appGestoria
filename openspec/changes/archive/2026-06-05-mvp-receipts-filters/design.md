# Design: MVP Receipts + Filters

## Technical Approach

Implement a mock-only Next.js App Router slice with one interactive receipts workspace at `/recibos` and one read-only owner ledger at `/propietarios/[id]/mayor`. The route pages stay thin and import local `data/` modules directly. Filtering state lives only in a small client component so the rest of the page can follow the existing server-component pattern. The visual language extends `DESIGN.md`: dense tables, visible filters, status chips, low-contrast borders, and sober financial-ERP spacing from `docs/03-diseno/mockups/dashboard` and `docs/03-diseno/mockups/mayor-propietario`.

## Architecture Decisions

| Decision | Choice | Alternatives considered | Rationale |
|---|---|---|---|
| Route model | `/recibos` plus `/propietarios/[id]/mayor` | Separate ordinary/extraordinary routes | One combined list validates filtering faster while the owner ledger remains a distinct drill-down. |
| Data source | Static TypeScript mock modules in `data/` | Fetch mocks, API routes, backend simulation | Keeps the prototype offline-safe and avoids implying validated persistence rules. |
| Interactivity boundary | `ReceiptWorkspace` as the only client component for filters | Make entire route client-side | Preserves App Router defaults and limits hydration to the part that needs state. |
| Ledger math | Show context and raw receipt rows only | Balances, debt totals, running saldo | Financial calculations are not validated and are explicitly out of scope. |

## Data Flow

```text
data/comunidades.ts ┐
data/propietarios.ts ├─ app/recibos/page.tsx ── ReceiptWorkspace ── filters ── table
data/recibos.ts     ┘                                      │
                                                           └─ owner Link → /propietarios/[id]/mayor

data/* ── app/propietarios/[id]/mayor/page.tsx ── derived owner receipts ── OwnerLedger
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `app/recibos/page.tsx` | Create | Receipts route; imports mock data and renders the workspace inside `MainContent`. |
| `app/propietarios/[id]/mayor/page.tsx` | Create | Owner ledger route; resolves owner by id, derives receipts, uses `notFound()` for invalid owners. |
| `components/recibos/receipt-workspace.tsx` | Create | `'use client'`; owns filter state and filtered result derivation. |
| `components/recibos/receipt-filters.tsx` | Create | Visible type, community, owner, date range, and status controls. |
| `components/recibos/receipt-table.tsx` | Create | Dense receipts table with owner links and empty state. |
| `components/recibos/owner-ledger.tsx` | Create | Read-only consolidated owner receipt table and context header. |
| `components/recibos/status-chip.tsx` | Create | Shared semantic badge styling. |
| `components/recibos/*.module.css` | Create | Table/filter/ledger styles reusing global CSS variables and DESIGN.md density. |
| `data/recibos.ts` | Create | 30–50 receipt mocks. |
| `data/propietarios.ts` | Create | 10–15 owner mocks. |
| `data/comunidades.ts` | Create | 3–5 community mocks. |
| `types/recibos.ts`, `types/propietarios.ts`, `types/comunidades.ts` | Create | Explicit mock-domain contracts. |
| `data/navigation.ts` | Modify | Change `Recibos` href from `#` to `/recibos`. |

## Interfaces / Contracts

```ts
export type ReceiptType = 'ordinary' | 'extraordinary';
export type ReceiptStatus = 'paid' | 'pending' | 'claimed' | 'judicial';

export interface Receipt {
  id: string;
  receiptNumber: string;
  type: ReceiptType;
  ownerId: string;
  communityId: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string;
  periodLabel: string;
  concept: string;
  amountCents: number;
  status: ReceiptStatus;
}
```

Owner rows include `id`, `displayName`, `unitReference`, and `communityId`. Community rows include `id`, `name`, and `municipality`.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Static safety | Type contracts, route imports, filter code | Run `npx tsc --noEmit`. |
| Lint/build | Next.js route validity | Run `npm run lint` if available; run `npm run build` if verification phase permits. |
| Manual | Filter combinations, empty state, owner drill-down, invalid owner route | Browser review with mock data; verify no backend/auth/network dependency. |

## Migration / Rollout

No migration required. This is mock-only and can be rolled back by deleting the new route/component/data/type files and reverting `data/navigation.ts`.

## Open Questions

- [ ] Which receipt statuses and labels match the user's real vocabulary?
- [ ] Does the user prefer combined receipts by default, or separate ordinary/extraordinary tabs after validation?
