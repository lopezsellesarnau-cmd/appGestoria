# Spec: Grupos de Reparto y Coeficientes

This change introduces two new capabilities. Both are additive — no existing spec requirements change.

---

## Capability: coeficientes-participacion

### Purpose

Model each owner's participation share in the community as a per-mille coefficient, surface it across owner and community views, and validate that the per-community sum equals 1000‰ (100%).

### Requirements

#### Requirement: Owner Coefficient Field

The `Owner` type MUST include a `coeficiente` numeric field expressed in per mille (‰) as an integer. Example: `125` means 12.5%.

#### Scenario: Owner carries a coefficient value

- GIVEN an owner in mock data belongs to a community
- WHEN the owner record is read
- THEN the value of `coeficiente` is a non-negative integer expressed in per mille
- AND the value is independent of any receipt or expense record

#### Scenario: Coefficient is the single source of share

- GIVEN a community with owners
- WHEN mock data is reviewed
- THEN each owner has exactly one `coeficiente` field
- AND there is no separate per-expense share field

#### Requirement: Coefficient Sum Validation

The system MUST compute the sum of `coeficiente` for all owners of a community. The sum MUST equal `1000` (100%) within a tolerance of `±1` (i.e., ±0.1%).

#### Scenario: Balanced community passes validation

- GIVEN a community whose owners' coefficients sum to exactly 1000‰
- WHEN the community detail page is rendered
- THEN no warning badge is shown for that community

#### Scenario: Unbalanced community shows a warning

- GIVEN a community whose owners' coefficients sum to a value outside the 999–1001‰ range
- WHEN the community detail page is rendered
- THEN a visible warning badge is shown indicating the sum deviation
- AND the actual sum and target are visible to the user

#### Scenario: Community with no owners is handled

- GIVEN a community has zero owners in mock data
- WHEN the sum is computed
- THEN the result is 0‰
- AND a warning badge is shown (cannot validate an empty community)

#### Requirement: Display Owner Coefficient

The system MUST show each owner's `coeficiente` on the owner list (`/propietarios`), the owner detail page, and the community detail page. The value MUST be displayed with the `‰` suffix and MAY also show the equivalent percentage.

#### Scenario: Coefficient appears in the owner list

- GIVEN the user opens `/propietarios`
- WHEN the owners table is rendered
- THEN each row shows the owner's `coeficiente` with the `‰` suffix

#### Scenario: Coefficient appears on the owner detail page

- GIVEN the user opens an owner detail view
- WHEN the owner context is rendered
- THEN the owner's `coeficiente` is visible with the `‰` suffix

#### Scenario: Coefficient appears on the community detail page

- GIVEN the user opens `/comunidades/[id]`
- WHEN the owners table for that community is rendered
- THEN each row shows the owner's `coeficiente` with the `‰` suffix
- AND the community's total coefficient sum is visible

---

## Capability: grupos-reparto

### Purpose

Model subsets of owners that share specific expenses (e.g., elevator users, ground floor), independent from the default per-coefficient split.

### Requirements

#### Requirement: DistributionGroup Type

The system MUST define a `DistributionGroup` type with fields: `id: string`, `communityId: string`, `name: string`, `type: "floor" | "zone" | "elevator" | "custom"`, `ownerIds: string[]`, and `createdAt: string` (ISO 8601).

#### Scenario: Group references its community

- GIVEN a `DistributionGroup` instance exists
- WHEN its fields are inspected
- THEN `communityId` references a valid community
- AND `ownerIds` contains only owner ids that belong to that same community

#### Scenario: Group has a typed category

- GIVEN a `DistributionGroup` instance exists
- WHEN the `type` field is read
- THEN it equals one of `floor`, `zone`, `elevator`, or `custom`
- AND the `name` is a human-readable label (e.g., "Planta baja", "Solo ascensor")

#### Requirement: Default Coefficient Fallback

The system MUST model, at the data level only, that an expense with no assigned group is split by coefficient across the community's owners. The system MUST NOT perform any automated receipt calculation in this change.

#### Scenario: Unassigned expense falls back to coefficient

- GIVEN an expense has no `groupId` assigned
- WHEN the fallback rule is consulted
- THEN the expense is conceptually split by coefficient
- AND no receipt amounts are computed or persisted

#### Scenario: No calculation in this change

- GIVEN this change is implemented
- WHEN receipts are inspected
- THEN receipt amounts are unchanged
- AND there is no new code path that derives receipt amounts from coefficients or groups

#### Requirement: Display Groups on Community Detail

The system MUST list all `DistributionGroup` instances of a community on `/comunidades/[id]`. Each group MUST show its name, type, and the count and names of assigned owners.

#### Scenario: Community detail lists its groups

- GIVEN a community has one or more `DistributionGroup` records
- WHEN `/comunidades/[id]` is rendered
- THEN a groups section appears
- AND each group shows its name, type badge, and assigned owner names

#### Scenario: Community with no groups shows an empty state

- GIVEN a community has no `DistributionGroup` records
- WHEN `/comunidades/[id]` is rendered
- THEN the groups section shows an explicit empty state
- AND the empty state communicates that expenses fall back to coefficient split

#### Requirement: Assign and Unassign Owners From Groups

The system MUST allow assigning an owner to a group and removing an owner from a group. Owner membership in a group MUST be reflected in the community detail display.

#### Scenario: Owner appears in the group after assignment

- GIVEN a group exists in the community
- WHEN an owner of that community is added to the group's `ownerIds`
- THEN the owner name appears in the group's assigned owners on the community detail page

#### Scenario: Owner disappears from the group after removal

- GIVEN a group exists in the community
- WHEN an owner is removed from the group's `ownerIds`
- THEN the owner name no longer appears in that group's assigned owners

#### Scenario: Group is not cross-community

- GIVEN a group belongs to community `com-A`
- WHEN the group's `ownerIds` are inspected
- THEN it contains no owners whose `communityId` is not `com-A`
