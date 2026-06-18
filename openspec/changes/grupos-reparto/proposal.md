# Proposal: Grupos de Reparto y Coeficientes

## Intent

Enable the prototype to model how expenses are distributed among owners in Spanish community administration. Currently, receipts assign flat amounts to owners without any split logic. This change introduces coefficients (ownership shares per mille) and expense-sharing groups (subsets of owners who split specific expenses), laying the data foundation for future receipt calculation — without implementing automated allocation yet.

## Scope

### In Scope
- Add `coeficiente` field to `Owner` type (per mille integer, e.g., 125 = 12.5%)
- Create `DistributionGroup` type: `{ id, name, communityId, ownerIds[] }`
- Add mock coefficient data for 5 communities and 3-4 groups across communities
- Validate: community coefficient sum SHALL equal 1000‰ within ±1 tolerance
- Display groups and coefficients on the community detail page (`/comunidades/[id]`)
- Default fallback: no group → expense splits by coefficient (model only, no calculation)

### Out of Scope
- Automated receipt amount calculation from coefficients/groups
- Expense-to-group assignment logic
- Group CRUD (create/edit/delete via UI)
- Connection to `ProviderExpense` or `Receipt` generation
- Self-consumption groups (individual water meters, etc.)
- Any backend, database, or persistence layer

## Capabilities

### New Capabilities
- `coeficientes-participacion`: Per mille coefficient field on Owner, mock data, and 1000‰ sum validation with tolerance
- `grupos-reparto`: DistributionGroup type definition, mock data, default coefficient fallback model, and read-only display on community detail

### Modified Capabilities
None. No existing spec requirements change — coefficients and groups are additive data that do not alter current receipt or owner-ledger behavior.

## Approach

Hybrid: data model (types + mock data) + read-only UI display. No automated calculation logic. New types go in `types/` (extend `propietarios.ts`, new `grupos-reparto.ts`). Mock data in `data/` (extend owner data, new group data). Display in existing community detail page via additional sections. Fields that would connect to receipts (`groupId` on `ProviderExpense`, coefficient-aware split) are deferred to a future change.

Coefficient representation: integer per mille (‰). Example: 125 = 12.5%. This matches Spanish escritura conventions and avoids floating-point precision issues.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `types/propietarios.ts` | Modified | Add `coeficiente: number` (per mille) |
| `types/grupos-reparto.ts` | New | `DistributionGroup` type |
| `data/propietarios.ts` | Modified | Add `coeficiente` to mock owners |
| `data/grupos-reparto.ts` | New | 3-4 mock groups across communities |
| `app/comunidades/[id]/page.tsx` | Modified | Display groups and coefficient info |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Per mille vs percentage confusion | Low | Document representation clearly; use `‰` suffix in labels |
| Sum tolerance causes false positives | Low | ±1‰ tolerance accounts for rounding; log validation warnings |
| User workflow differs from group model | Medium | Mock-only; no structural commitment until validated |

## Rollback Plan

Remove `coeficiente` field from `Owner` type, delete `types/grupos-reparto.ts` and `data/grupos-reparto.ts`, revert community detail page to prior state. All changes are additive; no migration needed.

## Dependencies

None. No new packages, services, or prior changes required.

## Success Criteria

- [ ] `Owner` type includes `coeficiente` (per mille integer)
- [ ] `DistributionGroup` type exists with `name`, `communityId`, `ownerIds[]`
- [ ] Mock data: 5 communities each have coefficients summing to 1000‰ (±1)
- [ ] Mock data: at least 3 groups defined across communities
- [ ] Community detail page shows owner coefficients and assigned groups
- [ ] TypeScript compilation clean (`npx tsc --noEmit`)
- [ ] No automated receipt calculation logic introduced
