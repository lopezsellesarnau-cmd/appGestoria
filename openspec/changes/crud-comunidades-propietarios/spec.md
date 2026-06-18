# Delta for community-crud and owner-crud

## ADDED Requirements

### Requirement: Community Create

The system MUST allow creating a community from `/comunidades/nueva` against in-memory mock state.

#### Scenario: Name required

- GIVEN the user is on `/comunidades/nueva`
- WHEN `name` is empty and the user submits
- THEN the form rejects the submission
- AND a validation message names `name` as required

#### Scenario: Valid submission creates community

- GIVEN `name` (and any optional fields) are present
- WHEN the user submits
- THEN a new community appears in `/comunidades` with a generated id
- AND the user is redirected to that list

#### Scenario: CIF format validated

- GIVEN the user enters a `cif` value
- WHEN it does not match the expected CIF pattern (letter + digits)
- THEN the form rejects the submission
- AND a message identifies the CIF field

### Requirement: Community Edit

The system MUST allow editing a community at `/comunidades/[id]/editar`.

- GIVEN a community with id `com-001` exists
- WHEN the user opens `/comunidades/com-001/editar`
- THEN fields are pre-populated with current values
- AND submitting valid changes updates the record visible in `/comunidades`

### Requirement: Community Delete Guarded By Owners

The system MUST block community deletion when at least one owner is associated.

- GIVEN a community has one or more owners
- WHEN the user triggers delete
- THEN the deletion is prevented
- AND a message indicates the community has propietarios

### Requirement: Community List Actions

The system MUST expose a "Nueva comunidad" entry on `/comunidades` plus row-level edit/delete actions.

- GIVEN the user is on `/comunidades`
- WHEN the user activates "Nueva comunidad"
- THEN the app navigates to `/comunidades/nueva`
- AND row actions expose edit (→ `/comunidades/[id]/editar`) and delete (subject to the guard)

---

### Requirement: Owner Create With Community Pre-Select

The system MUST allow creating an owner at `/propietarios/nuevo` and pre-select `communityId` from `?communityId=xxx`.

#### Scenario: Query preselects community

- GIVEN the user opens `/propietarios/nuevo?communityId=com-001`
- WHEN the form renders
- THEN the community selector is pre-set to `com-001`

#### Scenario: Required fields block submit

- GIVEN `displayName`, `unitReference`, `communityId`, or `coeficiente` is empty
- WHEN the user submits
- THEN the form rejects the submission
- AND a message names the missing field

#### Scenario: Valid submission creates owner

- GIVEN required fields are present and valid (see coeficiente requirement)
- WHEN the user submits
- THEN a new owner appears with a generated id and `isActive: true`

### Requirement: Owner Edit

The system MUST allow editing an owner at `/propietarios/[id]/editar`.

- GIVEN an owner with id `prop-007` exists
- WHEN the user opens `/propietarios/prop-007/editar`
- THEN fields are pre-populated
- AND submitting valid changes updates the record (re-running coeficiente validation)

### Requirement: Coeficiente Sum Equals 100 (±0.01)

The system MUST reject owner create/edit when the resulting sum of `coeficiente` for that community falls outside `100 ± 0.01`.

#### Scenario: Sum within tolerance accepted

- GIVEN other owners in the community sum to `74.99`
- WHEN the user enters `coeficiente: 25.02` (sum 100.01)
- THEN the form accepts the value

#### Scenario: Sum outside tolerance rejected

- GIVEN other owners sum to `74.99`
- WHEN the user enters `coeficiente: 30` (sum 104.99)
- THEN the form rejects
- AND a message says the coeficiente sum must equal 100 (±0.01)

#### Scenario: Edit excludes owner's old value

- GIVEN the user is editing owner A with current `coeficiente: 25`
- WHEN the sum is recomputed
- THEN A's new draft value is used (not double-counted against 25)

### Requirement: Owner Soft Delete And Active Filter

The system MUST soft-delete owners by setting `isActive = false`; the default owner list MUST hide inactive owners, with a filter exposing them.

#### Scenario: Soft delete hides owner

- GIVEN an owner is active
- WHEN the user soft-deletes
- THEN `isActive` becomes `false`
- AND `/propietarios` (default) no longer shows that owner

#### Scenario: Filter reveals inactive owners

- GIVEN at least one owner has `isActive: false`
- WHEN the user activates "show inactive"
- THEN inactive owners appear, clearly marked

### Requirement: Owner List Actions

The system MUST expose "Nuevo propietario" on `/propietarios`.

- GIVEN the user is on `/propietarios`
- WHEN the user activates "Nuevo propietario"
- THEN the app navigates to `/propietarios/nuevo`
