# Provider Ledger Specification

## Purpose

Define a minimal per-provider ledger that validates consolidated expense lookup while staying read-only, mock-only, and discovery-safe.

## Requirements

### Requirement: Consolidated Provider Expense History

The system MUST show a single provider's expenses together on `/proveedores/[id]/mayor` using the same mock dataset as `/proveedores`.

#### Scenario: Provider ledger shows all related expenses

- GIVEN the user opens a valid provider ledger route
- WHEN matching mock expenses exist for that provider
- THEN the page lists all expenses associated with that provider
- AND the list includes expenses from every referenced community in the dataset

#### Scenario: Provider with no expenses is still handled

- GIVEN the user opens a valid provider ledger route
- WHEN no mock expenses belong to that provider
- THEN the page shows an explicit no-expenses state
- AND the provider context remains visible

### Requirement: Minimal Ledger Context

The system SHOULD provide summary context that helps the user interpret the ledger without introducing validated accounting totals.

#### Scenario: Context is shown without financial math

- GIVEN the ledger page has one or more expenses
- WHEN the page is rendered
- THEN it shows provider identity and relevant community or date-range context
- AND it does not claim authoritative balances, pending totals, or Modelo 347 calculations

### Requirement: Discovery-Safe Prototype Boundaries

The system MUST keep this ledger exploratory and mock-only until the real workflow is validated.

#### Scenario: Unvalidated fiscal behaviors stay out of scope

- GIVEN the provider ledger prototype is reviewed
- WHEN a reviewer looks for exports, tax thresholds, VAT breakdowns, or legal flows
- THEN those behaviors are absent from this MVP slice
- AND the page remains limited to read-only mock consultation
