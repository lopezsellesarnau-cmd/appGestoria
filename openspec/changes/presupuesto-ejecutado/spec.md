# Budget vs Actual Specification

## Purpose

Define the per-community Presupuesto tab inside `/comunidades/[id]` that compares annual planned budget against actual spending aggregated live from GASTOS, with chapter-level variance indicators. Mock-only Phase 2 deliverable: no edit, allocation, or export.

## Requirements

### Requirement: Presupuesto Tab Inside Community Detail

The system MUST render a Presupuesto tab inside `/comunidades/[id]` alongside the existing Propietarios section, reachable through an underlined tab control (Gastos | Ingresos | Presupuesto) consistent with DESIGN.md.

#### Scenario: Tab renders for any community

- GIVEN the user opens `/comunidades/{id}` with mock data
- WHEN the page renders
- THEN an underlined tab control is shown
- AND the Presupuesto tab is selectable

### Requirement: Year Selector Defaults to Current Year

The system MUST provide a year selector inside the Presupuesto tab whose default is the current calendar year, and MUST allow the user to change the active year.

#### Scenario: Default year on first load

- GIVEN the user opens the Presupuesto tab
- WHEN the tab renders
- THEN the year selector shows the current year as the active value

#### Scenario: Year change reloads the table

- GIVEN the Presupuesto tab is showing year 2025
- WHEN the user selects 2024
- THEN the table re-renders with 2024 planned and actual figures

### Requirement: Budget Table by Chapter

The system MUST display a table with one row per chapter, where chapters map 1:1 to `ProviderExpenseCategory` (`cleaning`, `maintenance`, `insurance`, `utilities`, `administration`). Each row MUST show: chapter, presupuestado (€), ejecutado (€), diferencia (€), diferencia (%), status badge.

#### Scenario: All chapters render one row each

- GIVEN mock budget data exists for the selected community and year
- WHEN the Presupuesto tab renders
- THEN exactly one row per ProviderExpenseCategory is shown
- AND columns appear in order: Capítulo, Presupuestado, Ejecutado, Diferencia €, Diferencia %, Estado

#### Scenario: Empty planned budget for a chapter

- GIVEN a chapter has no planned amount for the selected year
- WHEN the row renders
- THEN presupuestado is shown as 0 €
- AND diferencia equals ejecutado

### Requirement: Live Actual Aggregation from GASTOS

The system MUST compute ejecutado by filtering `ProviderExpense` records by `communityId`, `category`, and year derived from `issueDate`. Ejecutado MUST NOT be stored or duplicated.

#### Scenario: Actual reflects matching GASTOS only

- GIVEN a community has ProviderExpense records across categories and years
- WHEN the Presupuesto tab renders
- THEN ejecutado equals the sum of `amountCents` for expenses matching the community, category, AND `issueDate` within the selected year
- AND other communities, categories, or years are excluded
- AND all monetary cells use es-ES EUR formatting

### Requirement: Variance Status Badge

The system MUST classify each chapter by comparing ejecutado to presupuestado and MUST render a color-coded badge: green (ejecutado < presupuestado), amber (ejecutado ≤ presupuestado × 1.10), red (ejecutado > presupuestado × 1.10).

#### Scenario: Under budget shows green

- GIVEN presupuestado 1000 € and ejecutado 800 €
- WHEN the row renders
- THEN the badge is green with label equivalent to "Bajo presupuesto"

#### Scenario: Within 10% over shows amber

- GIVEN presupuestado 1000 € and ejecutado 1050 €
- WHEN the row renders
- THEN the badge is amber with label equivalent to "Cerca del límite"

#### Scenario: Over 10% shows red

- GIVEN presupuestado 1000 € and ejecutado 1200 €
- WHEN the row renders
- THEN the badge is red with label equivalent to "Excedido"

### Requirement: Mock-Only Data Source

The system MUST source planned amounts from `data/presupuesto.ts` and MUST NOT introduce a database, API route, or external service. The tab renders entirely from `data/presupuesto.ts` plus `data/proveedores.ts` with no auth or external integration.
