# Proposal: CRUD Comunidades y Propietarios

## Intent

The prototype is read-only — users browse communities and owners but cannot add or modify them. This change introduces create, edit, and deactivate operations so the prototype supports the full mock-data lifecycle.

## Scope

### In Scope
- Community create/edit forms at `/comunidades/nueva`, `/comunidades/[id]/editar`
- Owner create/edit forms at `/propietarios/nuevo`, `/propietarios/[id]/editar`
- Soft delete for owners (`isActive` flag); hard-delete blocked if receipts exist
- Coeficiente sum validation (±0.01 tolerance) when adding/editing owners in a community
- Expanded Community and Owner types (address, contact, bank, fiscal fields)
- React Context + useReducer for mutable mock-data state (no new dependencies)
- Owner creation linkable via `?communityId=xxx` from community detail
- Pure validation functions in `lib/comunidades/validation.ts`, `lib/propietarios/validation.ts`

### Out of Scope
- Backend, database, Prisma, or real persistence
- Authentication, authorization, API routes
- Community soft-delete (edit-only in this phase)
- Bulk operations, imports, exports, receipt CRUD

## Capabilities

### New Capabilities
- `community-crud`: Create, read, update communities with required-field and CIF/NIF validation
- `owner-crud`: Create, read, update, soft-delete owners with coeficiente sum validation and community association

### Modified Capabilities
None — existing specs cover read-only views; those remain unchanged.

## Approach

Separate route forms following existing page-per-view convention. Each form is an independent `app/` route page. State managed via a single `DataContext` (React Context + useReducer) operating on in-memory arrays initialized from `data/*.ts` mock files. Validation is pure functions — no side effects, easy to swap for API calls later.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `types/comunidades.ts` | Modified | Add cif, address, province, postalCode, phone, email, bankAccount, notes, timestamps |
| `types/propietarios.ts` | Modified | Add nif, email, phone, coeficiente, bankAccount, isActive, notes, timestamps |
| `data/comunidades.ts` | Modified | Expand mock entries to match new fields |
| `data/propietarios.ts` | Modified | Expand mock entries, set isActive defaults |
| `app/comunidades/nueva/page.tsx` | New | Community create form |
| `app/comunidades/[id]/editar/page.tsx` | New | Community edit form |
| `app/propietarios/nuevo/page.tsx` | New | Owner create form (supports ?communityId) |
| `app/propietarios/[id]/editar/page.tsx` | New | Owner edit form |
| `lib/comunidades/validation.ts` | New | Pure validation for community fields |
| `lib/propietarios/validation.ts` | New | Coeficiente sum + field validation |
| `lib/data-context.tsx` | New | React Context + useReducer provider |
| `components/` | New/Modified | Shared form primitives as needed |
| `app/comunidades/page.tsx` | Modified | Add "Nueva comunidad" action |
| `app/comunidades/[id]/page.tsx` | Modified | Add edit link, owner CRUD access |
| `app/propietarios/page.tsx` | Modified | Add "Nuevo propietario" action |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Coeficiente float rounding (sum ≠ 100) | Medium | ±0.01 tolerance; warn on small drift |
| Owner reassignment to different community | Low | Accept in prototype; document behavior |
| Form component surface grows beyond scope | Low | Reuse shadcn/ui primitives; defer custom libs |

## Rollback Plan

Revert the commit. Mock data files are the only persistent state — originals in git history. No database migrations, no API changes.

## Dependencies

- Existing shadcn/ui primitives (Button, Input, Select, Table, Badge)
- May need `Label` component (installable via `npx shadcn-ui@latest add label`)

## Success Criteria

- [ ] Communities can be created, edited, and appear in the browse list
- [ ] Owners can be created, edited, and soft-deleted
- [ ] Coeficiente validation rejects sums outside 99.99–100.01
- [ ] Soft-deleted owners hidden by default, visible with filter toggle
- [ ] Owner create form pre-selects community via `?communityId=xxx`
- [ ] `npx tsc --noEmit` and `npm run lint` pass with no errors
- [ ] `npm run build` succeeds
