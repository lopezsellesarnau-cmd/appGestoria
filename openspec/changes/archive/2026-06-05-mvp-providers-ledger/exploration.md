## Exploration: MVP Providers + Ledger

### Current State

The project ("Fincas Pro") is in frontend prototype phase with mock data only, no backend:

- **What exists**: Base layout (sidebar + topbar + app shell), `/recibos` filterable receipts page with 45 mock receipts, and `/propietarios/[id]/mayor` owner ledger. All implemented with Next.js 14.2 App Router, React 18.3, TypeScript 5.4 strict, CSS Modules, and global CSS custom properties (`globals.css`).
- **Proveedores status**: Listed in navigation sidebar at `data/navigation.ts` as `"Proveedores"` with `href: "#"`. No route, no component, no type, no mock data exists.
- **Provider domain**: Mentioned in discovery docs as "Mayor de proveedores filtrado por fechas y comunidades" and "Consulta orientada al Modelo 347." The glossary defines "Proveedor" as entity that provides services or invoices to a community. These are user-mention-level references — not validated workflows.
- **Existing reusable patterns**:
  - **Thin server page** → passes mock data to a `'use client'` workspace component
  - **Workspace** owns filter state (`useState` + `useMemo`), derives filtered results
  - **Filters** as flat state object with `"all"` sentinel values, `<select>` and `<input type="date">` controls
  - **Table** with zebra stripes, `amountCents` → EUR formatting, status chips, empty state
  - **Ledger** with context header (entity info + back link) + read-only table, no financial math
  - **CSS Modules** per component, using global CSS vars (`--color-border`, `--color-surface`, `--color-text`, etc.)
  - **Mock data** strictly separated in `data/`, types in `types/`
  - **Two client boundaries**: one workspace wrapper + one filter component (both `'use client'`)

### User Pain This Validates

The discovery doc confirms providers as a frequent consultation need. The MVP doc lists "Mayor de proveedor" as a candidate requirement. The specific pain points relevant here:

1. **Filter providers by community and date range** — explicitly mentioned in discovery
2. **Quick lookup of provider history** — what was paid, when, for what concept
3. **Modelo 347 orientation** — the user needs to consult provider amounts by tax year, but the *exact* threshold and grouping rules are not validated yet

Because the user demo is still pending, this slice keeps the provider domain exploratory and mock-only. The data model must be simple enough to throw away or restructure later.

### Affected Areas

| Area | Action | Description |
|------|--------|-------------|
| `types/proveedores.ts` | **New** | Provider and Expense domain types (see Approaches for model options) |
| `data/proveedores.ts` | **New** | Mock providers (10–15) and expenses (30–50 rows) |
| `components/proveedores/provider-filters.tsx` | **New** | Filter controls: community, provider, date range, expense category, amount range, payment status |
| `components/proveedores/provider-filters.module.css` | **New** | Filter layout (reuse pattern from `components/recibos/receipt-filters.module.css`) |
| `components/proveedores/provider-table.tsx` | **New** | Dense expenses table with provider links, community reference, amount, status |
| `components/proveedores/provider-table.module.css` | **New** | Table styles (reuse pattern from `receipt-table.module.css`) |
| `components/proveedores/provider-workspace.tsx` | **New** | `'use client'` — filter state owner, filtered derivation |
| `components/proveedores/provider-workspace.module.css` | **New** | Workspace layout |
| `components/proveedores/provider-ledger.tsx` | **New** | Per-provider consolidated expenses table with context header |
| `components/proveedores/provider-ledger.module.css` | **New** | Ledger-specific styles (reuse pattern from `owner-ledger.module.css`) |
| `components/proveedores/expense-status-chip.tsx` | **New** | Payment status badge (paid/pending/overdue) — semantically distinct from receipt status |
| `components/proveedores/expense-status-chip.module.css` | **New** | Chip colors for expense statuses |
| `app/proveedores/page.tsx` | **New** | Expenses list route; thin server page importing mock data |
| `app/proveedores/[id]/mayor/page.tsx` | **New** | Provider ledger route; resolves provider by id, derives expenses, `notFound()` for invalid |
| `data/navigation.ts` | **Modify** | Change `Proveedores` href from `#` to `/proveedores` |

### Approaches

#### 1. Simple Expense Model (receipt-parallel)

Model expenses analogously to receipts: each expense has a provider reference, community, date, concept, amount, and payment status. No invoice number, no tax breakdown, no accounting categories.

```
Provider { id, businessName, taxId (CIF/NIF), communityId, isActive }
Expense  { id, providerId, communityId, issueDate, dueDate, concept, amountCents, paymentStatus, category }
```

- **Pros**: Simplest to build; directly parallels existing receipts pattern; no implied accounting rules; easiest to iterate/throw away after user demo
- **Cons**: Doesn't capture invoice-specific fields (series, number, VAT breakdown); may need restructuring when real workflow is validated
- **Effort**: Low

#### 2. Invoice Model (factura-oriented)

Model expenses as invoices with document references: invoice series + number, tax base, VAT rate, withholding, etc. More realistic for Spanish gestoría context.

- **Pros**: Closer to real-world documents the user handles; better alignment with Modelo 347 requirements
- **Cons**: Heavy for a prototype; risks implying validated tax/fiscal rules that haven't been confirmed; more fields to mock meaningfully; overengineering for a discovery phase
- **Effort**: Medium-High

#### 3. Hybrid Minimal: Expense with invoice reference but no tax breakdown

Expense type includes an optional `invoiceNumber` field but no VAT/withholding breakdown. Enough to show that expenses correspond to real documents without committing to tax accounting.

- **Pros**: Retains simplicity while hinting at invoice structure; easy to enrich later; keeps prototype honest about what's validated vs. assumed
- **Cons**: Not as purely simple as approach 1; may still lead to assumptions about invoice format
- **Effort**: Low-Medium

#### Route and navigation approach

All three approaches share the same route model (mirrors the receipts slice):

- `/proveedores` — Filterable expenses table (all expenses across selected filters)
- `/proveedores/[id]/mayor` — Per-provider consolidated expenses view

### Recommendation

**Approach 1 (Simple Expense Model)** with an optional `invoiceNumber` and `category` field (essentially approach 3 but without over-building the category taxonomy).

Rationale:

1. **Parallels existing receipts pattern** — reuses the same architectural decisions, component structure, and CSS Module patterns. Lower cognitive overhead for code review.
2. **Discovery-safe** — no implied tax/fiscal rules. If the user demo reveals a different structure, we haven't committed to an invoice model.
3. **Category as a lightweight grouping** — a string label (e.g. "Limpieza", "Seguros", "Mantenimiento", "Suministros") gives the user something to filter by without pretending it's a validated chart of accounts.
4. **Cover the Modelo 347 orientation need** — the expense list already includes amount and provider, which is the raw data needed for 347. The *grouping by tax year* and *threshold logic* stay out of scope until validated.
5. **Change name `mvp-providers-ledger` is appropriate** — mirrors the previous `mvp-receipts-filters` convention and accurately describes the scope: provider listing + provider drill-down ledger.

### What Stays OUT OF SCOPE

- ❌ Balance calculations, pending totals, running saldo
- ❌ Modelo 347 threshold logic or tax-year grouping
- ❌ VAT breakdown, withholding, tax base (invoice-level tax fields)
- ❌ Real CIF/NIF validation or tax ID formatting
- ❌ Expense → receipt allocation (linking expenses to owner charges)
- ❌ CSV export for this slice (can be a follow-up after both list views exist)
- ❌ Norma 43/19, emails, auth, real backend
- ❌ Provider CRUD beyond mock data

### Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Expense data model wrong | Medium | Keep it simple — throwaway-safe mock model, no backend lock-in |
| User demo still pending | High | Build fast and cheap; this slice stays in mock-only discovery territory |
| Category field may imply validated account structure | Medium | Document clearly in spec that categories are mock labels, not a validated chart of accounts |
| Provider domain may overlap with receipt domain (owner charges vs. provider expenses) | Medium | Keep completely separate data files; no cross-referencing logic in this slice |
| Reusing `status-chip.tsx` from `components/recibos/` would couple two domains | Low | Create separate `expense-status-chip.tsx` in `components/proveedores/` to keep domain boundaries clean |
| 400-line review budget may be tight | Medium | Estimated ~1100–1300 lines for full slice (new types + data + components + routes). Similar to previous slice. |

### Ready for Proposal

Yes — the direction is clear. This slice directly follows the established pattern from `mvp-receipts-filters`. The orchestrator should propose a single change covering the provider expenses list + provider ledger, with the simple expense model (approach 1 + optional invoiceNumber/category). The spec phase should explicitly document which expense fields are discovery assumptions vs. validated requirements.
