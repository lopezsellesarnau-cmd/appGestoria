# Delta Spec: Expense Comparison

## Purpose

Define a per-community year-over-year provider expense comparison view that lets a gestor detect cost trends across two selected years using mock data only.

## ADDED Requirements

### Requirement: Comparison Route Per Community

The system MUST expose a community-scoped route at `/comunidades/[id]/comparativos` and MUST provide a navigation link from the community detail page at `/comunidades/[id]` to that route.

#### Scenario: Link visible from community detail

- GIVEN the user is on a community detail page that exists in the mock dataset
- WHEN the page renders
- THEN a link labelled for expense comparison is visible
- AND selecting it navigates to `/comunidades/[id]/comparativos` for the same community

#### Scenario: Route renders for any valid community id

- GIVEN the user opens `/comunidades/[id]/comparativos` for a community id present in `COMUNIDADES`
- WHEN the route loads
- THEN it renders the comparison view using mock provider expense data filtered by that community id
- AND it does not require auth, a database, or external services

#### Scenario: Unknown community id is rejected

- GIVEN the user opens `/comunidades/[id]/comparativos` for an id not present in `COMUNIDADES`
- WHEN the route loads
- THEN the system triggers the standard not-found behaviour
- AND no mock data from other communities is shown

### Requirement: Two-Year Selection Filter

The system MUST let the user pick exactly two distinct years from the set of years present in that community's provider expenses, and MUST default Year A to the most recent year with expenses and Year B to the previous distinct year.

#### Scenario: Default selection on first load

- GIVEN the community has provider expenses in at least two distinct calendar years
- WHEN the comparison view first renders
- THEN Year A defaults to the most recent year with expenses
- AND Year B defaults to the previous distinct year with expenses

#### Scenario: Changing the selection updates the view

- GIVEN the comparison view is rendered
- WHEN the user changes Year A or Year B
- THEN every section on the page recomputes against the new pair
- AND a year cannot be selected for both Year A and Year B

#### Scenario: Single-year community is handled

- GIVEN the community has provider expenses in only one calendar year
- WHEN the comparison view renders
- THEN the second year selector is disabled or absent
- AND the page shows an explicit message that no comparison is possible

### Requirement: Summary Metrics

The system MUST display three summary metric cards: Year A total, Year B total, and percentage change between them, with Year A as the base.

#### Scenario: Metrics reflect selected years

- GIVEN a valid year pair is selected
- WHEN the page computes totals
- THEN the Year A total equals the sum of `amountCents` of that community's provider expenses whose `issueDate` year matches Year A
- AND the Year B total uses the same rule for Year B
- AND the percentage change is shown with a sign

#### Scenario: Division by zero is avoided

- GIVEN Year B total is zero and Year A total is positive
- WHEN the percentage change is computed
- THEN the system shows a finite indicator (e.g. "nuevo" or "—") instead of `Infinity` or `NaN`

### Requirement: Category Breakdown Bar Chart

The system MUST render a side-by-side bar chart comparing total spend per expense category for the two selected years, with one bar per year per category.

#### Scenario: Chart shows both years per category

- GIVEN at least one provider expense exists for the selected years
- WHEN the chart renders
- THEN each category present in either year appears as a group
- AND the group contains one bar for Year A and one bar for Year B
- AND the bar heights reflect the sum of `amountCents` for that category and year

#### Scenario: Chart handles categories present in only one year

- GIVEN a category exists in Year A but not Year B
- WHEN the chart renders
- THEN the Year B bar for that category has a value of zero
- AND the category still appears in the chart

### Requirement: Year-over-Year Comparison Table

The system MUST display a table that breaks expenses down by category, with a YoY delta column expressed as absolute amount and percentage, plus a final totals row.

#### Scenario: Table aggregates by category

- GIVEN the comparison view is rendered
- WHEN the category table is shown
- THEN each row aggregates all provider expenses for the selected community in a single category and year
- AND rows include Year A total, Year B total, absolute delta, and percentage delta
- AND a final totals row shows the sum across all categories

#### Scenario: Table aggregates by provider

- GIVEN the comparison view is rendered
- WHEN the provider table is shown
- THEN each row aggregates all provider expenses for a single provider and year within the selected community
- AND providers absent in a given year are shown with a zero value for that year

### Requirement: Mock-Only Boundary And Empty State

The system MUST show a visible mock-data label and MUST show an explicit empty state when a community has no provider expenses, keeping the community context header visible in both cases.

#### Scenario: Mock data label is visible

- GIVEN the comparison view is rendered
- WHEN the page loads
- THEN a visible label in Spanish indicates that the data is mock and pending real validation

#### Scenario: Community with no provider expenses

- GIVEN the community has zero provider expenses in the mock dataset
- WHEN the comparison view renders
- THEN the year selector, metrics, chart, and table are not rendered
- AND an explicit empty state explains the situation
- AND the community context header remains visible
