# Receipts List Specification

## Purpose

Define a mock-only receipts workspace that validates whether fast, visible filters and dense listings improve day-to-day lookup for ordinary and extraordinary receipts.

## Requirements

### Requirement: Combined Receipts Listing

The system MUST present ordinary and extraordinary receipts in a single dense table on `/recibos` using mock data only.

#### Scenario: Mixed receipts render together

- GIVEN the user opens `/recibos`
- WHEN mock data is available
- THEN the page shows at least 30 receipts in one table
- AND each row identifies enough context to distinguish receipt type, owner, community, date, and status

#### Scenario: No backend dependency

- GIVEN the prototype is reviewed offline or without real services
- WHEN `/recibos` is loaded
- THEN the page renders from local mock data
- AND it does not require auth, database access, or external integrations

### Requirement: Visible Multi-Filter Controls

The system MUST expose visible filters for type, community, owner, date range, and status, and MUST allow them to work independently and in combination.

#### Scenario: Combined filtering narrows results

- GIVEN the receipts table contains mixed mock records
- WHEN the user applies more than one filter
- THEN only rows matching all active filters remain visible

#### Scenario: Empty result state remains usable

- GIVEN active filters match no receipts
- WHEN the filtered result is empty
- THEN the page shows an explicit empty state
- AND the active filters remain visible so the user can adjust them

### Requirement: Drill-down to Owner Ledger

The system SHALL allow navigation from a receipt row to the ledger view of that receipt's owner.

#### Scenario: Owner link opens ledger

- GIVEN a visible receipt row has an owner reference
- WHEN the user selects that owner
- THEN the app navigates to `/propietarios/[id]/mayor`
- AND the destination corresponds to the selected owner
