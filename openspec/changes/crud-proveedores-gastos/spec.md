# Delta Spec: `crud-proveedores-gastos`

## Purpose

Add create, edit, and soft-delete operations for providers and their expenses on the existing read-only mock prototype, plus the new payment fields needed to track how and when expenses were paid. Categories become an extensible single source of truth.

---

## ADDED Requirements

### Capability: `provider-crud`

#### Requirement: Extended Provider Schema

The system MUST extend the `Provider` type with optional `address`, `phone`, `email`, `iban`, and `notes` string fields, keeping `id`, `businessName`, `taxId`, `communityId`, and `isActive` mandatory and backward-compatible.

#### Scenario: Backward compatibility

- GIVEN existing mock providers without the new fields
- WHEN the type is extended
- THEN all records still compile and the listing still renders

#### Scenario: Missing fields show em-dash placeholder

- GIVEN a provider row missing `address`, `phone`, `email`, or `iban`
- WHEN the listing renders
- THEN each missing field shows `—`

#### Requirement: Provider Create and Edit via Dialog

The system MUST open a `Dialog` from `/proveedores` to create or edit a provider, persisting the change to the in-memory mock array and re-rendering the table on save.

#### Scenario: Nuevo proveedor opens empty form

- GIVEN the user is on `/proveedores`
- WHEN the user clicks the "Nuevo proveedor" button in the page header
- THEN a Dialog opens with empty fields for all Provider attributes

#### Scenario: Edit row action prefills and saves

- GIVEN a provider row in the table
- WHEN the user clicks the row's edit action
- THEN a Dialog opens prefilled with current values
- AND saving replaces the record in the mock array and closes the Dialog

#### Requirement: Provider Soft Delete

The system MUST soft-delete a provider by toggling `isActive` to `false` from the listing, hiding it from the default active view while keeping it recoverable.

#### Scenario: Delete requires confirmation naming the provider

- GIVEN a provider row
- WHEN the user clicks the row's delete action
- THEN a confirmation Dialog appears naming the provider

#### Scenario: Confirmed delete hides provider but keeps record

- GIVEN the user confirmed deletion
- WHEN the action completes
- THEN the row leaves the active listing
- AND the record remains in mock data with `isActive: false`

---

### Capability: `provider-expense-crud`

#### Requirement: Extended Expense Schema

The system MUST add optional `paymentDate` (ISO date string) and `paymentMethod` (`"transfer" | "cash" | "direct_debit" | "receipt"`) to `ProviderExpense`, keeping all existing fields intact.

#### Scenario: Backward compatibility

- GIVEN current mock expenses without `paymentDate` or `paymentMethod`
- WHEN the type is extended
- THEN all records still compile and the listing still renders

#### Requirement: Expense Create and Edit via Dialog

The system MUST open a `Dialog` from `/proveedores/[id]/mayor` to create or edit an expense, persisting to the mock array and triggering a totals recalculation.

#### Scenario: Nuevo gasto opens empty form in ledger header

- GIVEN the user is on a provider ledger page
- WHEN the user clicks the "Nuevo gasto" button
- THEN a Dialog opens with empty fields for all expense attributes

#### Scenario: Edit row action prefills and saves

- GIVEN an expense row in the ledger
- WHEN the user clicks the row's edit action
- THEN a Dialog opens prefilled with current values
- AND saving updates the mock array, row, and ledger totals

#### Requirement: Expense Delete with Confirmation

The system MUST remove an expense from the mock array after explicit confirmation, updating the ledger totals and filtered list immediately.

#### Scenario: Confirmed delete removes row and updates totals

- GIVEN an expense row
- WHEN the user clicks the row's delete action and confirms
- THEN the row disappears
- AND Total / Pagado / Pendiente values reflect the change

#### Requirement: Payment Status Derived From paymentDate

The system MUST derive `paymentStatus` from `paymentDate` presence: non-empty maps to `"paid"`, empty maps to `"pending"`. The form MUST NOT expose a `paymentStatus` input.

#### Scenario: Setting paymentDate marks expense paid

- GIVEN an expense form with no `paymentDate`
- WHEN the user enters a `paymentDate` and saves
- THEN the saved expense has `paymentStatus: "paid"`

#### Scenario: Clearing paymentDate marks expense pending

- GIVEN an expense form with a `paymentDate` set
- WHEN the user clears it and saves
- THEN the saved expense has `paymentStatus: "pending"`

#### Requirement: Extensible Categories Config

The system MUST read expense categories from a single `lib/proveedores/categories.ts` config object seeded with the 5 defaults (`cleaning`, `maintenance`, `insurance`, `utilities`, `administration`) plus their Spanish labels, and the filter UI MUST render options from that config.

#### Scenario: Adding a category extends filters without other code changes

- GIVEN a new entry is added to the categories config
- WHEN the page reloads
- THEN the new category appears in the filter dropdown
- AND existing expenses with that key render with its label
