## Exploration: MVP Receipts + Filters

### Current State

The project ("Fincas Pro") is in early frontend prototype phase:

- **Stack**: Next.js 14.2 App Router, React 18.3, TypeScript 5.4 strict, CSS modules (custom design tokens).
- **What exists**: Base layout only — `app-shell.tsx`, `sidebar.tsx`, `topbar.tsx`, `main-content.tsx`. The sidebar lists 10 nav sections (all hrefs are `#`). The homepage shows a dashboard placeholder with no data.
- **No routes exist** beyond `/`. No test runner. Minimal dependencies (React, Next, TypeScript only).
- **Mock data**: No mock data files exist yet. `data/` has only `navigation.ts`.
- **Design direction**: Dense tables, visible filters, fast searches, professional/sober aesthetic.
- **OpenSpec config**: confirms `strict_tdd: false`, no test runner, manual verification only.

### User Pain This Validates

The most concrete confirmed pain from discovery (docs/01-discovery/observaciones/discovery.md) is:

> "El programa actual no ofrece suficientes opciones de filtros y listados. Los listados que sí proporciona son incompletos o demasiado básicos."

Receipts (ordinary fees + extraordinary assessments) are the core transactional data in community property management. Building receipts-first validates:

1. **Can we make filtering fast and useful?** — The #2 confirmed pain.
2. **Do the right data shapes emerge?** — Receipts involve owners, communities, types, amounts, dates, statuses.
3. **Can we beat the current software's UX?** — Speed of filtering + clarity of data display.

If the user sees a fast, filterable receipts list and says "this is useful but I need X," that's real validation. If the data model is wrong, we find out cheaply — no backend, no migrations.

### Affected Areas

- `app/recibos/page.tsx` — New: Receipt list page route (App Router)
- `components/recibos/` — New directory: receipt list, filters, table components
- `data/recibos.ts` — New: mock receipt data (separated from UI per project convention)
- `data/propietarios.ts` — New: mock owner data (needed for receipt context)
- `data/comunidades.ts` — New or minimal: mock community data (for filtering context)
- `types/recibos.ts` — New: receipt domain types/interfaces
- `types/propietarios.ts` — New: owner domain types
- `types/comunidades.ts` — New: community domain types
- `data/navigation.ts` — Update: change `Recibos` href from `#` to `/recibos`

### Approaches

1. **Single consolidated receipts screen** — One page with a filterable table showing ALL receipts (ordinary + extraordinary), with a type filter toggle.
   - Pros: Fastest to build; one page validates the core hypothesis; simplest to iterate
   - Cons: May mix concerns; the user might prefer separate views by default
   - Effort: Low

2. **Separate pages for ordinary receipts, extraordinary receipts, and owner ledger** — Each gets its own route and filter set.
   - Pros: Clear separation; maps directly to MVP spec items; easier to navigate as modules grow
   - Cons: More boilerplate upfront; might create artificial boundaries before user validates what they need
   - Effort: Medium

3. **Hybrid: one receipts page (approach 1) with a separate owner ledger view** — The main page handles all receipts with filters; a second page provides the per-owner consolidated view (Mayor).
   - Pros: Covers the two most likely first needs; owner ledger is a distinct enough concern to justify a separate page; keeps things simple otherwise
   - Cons: Two pages instead of one; still requires some extra effort for the ledger
   - Effort: Low-Medium

### Recommendation

**Approach 3 (Hybrid):** Start with a single `/recibos` page featuring a dense filterable table, with a type filter (todos/ordinarios/extraordinarios) plus community, owner, date range, and status filters. Then add an owner detail page `/propietarios/[id]/mayor` for the consolidated receipt view.

Rationale:
- The single consolidated page is the fastest path to getting something in front of the user and validating whether the filtering strategy works.
- The owner ledger is the natural "drill-down" view — it's a separate concern (per-owner context, cumulative view) that justifies a separate page.
- This avoids premature separation of ordinary vs. extraordinary while still providing two distinct experiences.
- All mock data can be shared between both views.

### What Stays OUT OF SCOPE (Until User Validation)

- ❌ Balance calculations, pending total math, or financial totals (these need domain validation)
- ❌ Real CSV export (simple download of current view is acceptable)
- ❌ Norma 43 / Norma 19 integration
- ❌ Debtor tracking as a feature (depends on what "pending" means in real workflow)
- ❌ Provider ledger
- ❌ Cross-community comparisons
- ❌ Email or communication features
- ❌ Authentication
- ❌ Real backend or database
- ❌ Any server-side data processing

### Future Spec Sequence (MVP Roadmap)

```
1. ⬅ THIS CHANGE: Receipts list + filters + owner ledger (Mayor)
2. Provider list + provider ledger with filters
3. Debtors view (validated after user confirms what "pending" means)
4. CSV export for all list views
5. Owner/unit management
6. Community detail page with linked data
7. Extended filtering: fiscal (Modelo 347) after validation
8. Dashboard KPIs and quick actions
```

### Risks

- **No user validation yet** — The data model (receipt types, statuses, community structure) is based on discovery notes, not real observation. The user demo is still pending.
- **No test suite** — Manual verification only. Relies on type-checking (`npx tsc --noEmit`) for structural safety.
- **Design tokens may not support dense tables** — No table components exist yet. The first table implementation will establish patterns for all future screens.
- **Minimal dependencies** — Only React/Next/TypeScript are installed. No shadcn, no lucide-react, no utility libraries. This is by design (project rules), but means more manual component work.
- **Receipt domain ambiguity** — Discovery mentions "ordinarios" and "extraordinarios" but details (periodicity, amounts, associations to owners/units) need validation.

### Ready for Proposal

Yes — the direction is clear enough. The orchestrator should propose a single change for receipts list + filters + owner ledger, keeping scope tight and data model tentative until user validation.
