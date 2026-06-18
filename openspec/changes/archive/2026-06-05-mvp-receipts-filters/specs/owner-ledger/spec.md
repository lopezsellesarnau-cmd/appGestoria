# Owner Ledger Specification

## Purpose

Define a minimal per-owner ledger that validates consolidated receipt lookup without committing to final accounting rules or calculations.

## Requirements

### Requirement: Consolidated Owner Receipt History

The system MUST show a single owner's ordinary and extraordinary receipts together on `/propietarios/[id]/mayor` using the same mock dataset as `/recibos`.

#### Scenario: Owner ledger shows all related receipts

- GIVEN the user opens a valid owner ledger route
- WHEN matching mock receipts exist for that owner
- THEN the page lists all receipts associated with that owner
- AND the list includes both ordinary and extraordinary receipts when both exist

#### Scenario: Owner with no receipts is still handled

- GIVEN the user opens a valid owner ledger route
- WHEN no mock receipts belong to that owner
- THEN the page shows an explicit no-receipts state
- AND the owner context remains visible

### Requirement: Minimal Ledger Context

The system SHOULD provide summary context that helps the user interpret the ledger without introducing validated accounting totals.

#### Scenario: Context is shown without financial math

- GIVEN the ledger page has one or more receipts
- WHEN the page is rendered
- THEN it shows owner identity and relevant community or date-range context
- AND it does not claim authoritative balances, debt totals, or accounting calculations

### Requirement: Discovery-Safe Prototype Boundaries

The system MUST keep this ledger exploratory and mock-only until the real workflow is validated.

#### Scenario: Unvalidated behaviors stay out of scope

- GIVEN the receipt ledger prototype is reviewed
- WHEN a reviewer looks for exports, legal debt flows, or bank integrations
- THEN those behaviors are absent from this MVP slice
- AND the page remains limited to read-only mock consultation
