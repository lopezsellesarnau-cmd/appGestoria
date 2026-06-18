# Provider Expenses List Specification

## Purpose

Define a mock-only provider expenses workspace that validates fast consultation by community, provider, date range, category, and payment status without implying final accounting or fiscal rules.

## Requirements

### Requirement: Combined Provider Expenses Listing

The system MUST present provider expenses in a single dense table on `/proveedores` using mock data only.

#### Scenario: Mixed expenses render together

- GIVEN the user opens `/proveedores`
- WHEN mock provider expenses are available
- THEN the page shows at least 30 expense rows in one table
- AND each row shows provider, community, concept, issue date, amount, and payment status

#### Scenario: No backend dependency

- GIVEN the prototype is reviewed without real services
- WHEN `/proveedores` is loaded
- THEN the page renders from local mock data
- AND it does not require auth, database access, or external integrations

### Requirement: Visible Multi-Filter Controls

The system MUST expose visible filters for community, provider, date range, category, and payment status, and MUST allow them to work independently and in combination.

#### Scenario: Combined filtering narrows results

- GIVEN the expenses table contains mixed mock records
- WHEN the user applies more than one filter
- THEN only rows matching all active filters remain visible

#### Scenario: Empty result state remains usable

- GIVEN active filters match no expenses
- WHEN the filtered result is empty
- THEN the page shows an explicit empty state
- AND the active filters remain visible so the user can adjust them

### Requirement: Drill-down to Provider Ledger

The system SHALL allow navigation from an expense row to the ledger view of that expense's provider.

#### Scenario: Provider link opens ledger

- GIVEN a visible expense row has a provider reference
- WHEN the user selects that provider
- THEN the app navigates to `/proveedores/[id]/mayor`
- AND the destination corresponds to the selected provider
