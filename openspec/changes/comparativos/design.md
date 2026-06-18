# Design: Comparativos Interanual de Gastos

## Technical Approach

Ruta anidada bajo la comunidad (`/comunidades/[id]/comparativos`) que sigue el patrón de `/propietarios/[id]/mayor` y `/proveedores/[id]/mayor`. Una página server-component resuelve la comunidad, filtra `GASTOS` por `communityId` y delega a un workspace client-side. El workspace mantiene el par de años seleccionado, deriva agregaciones puras (year → total, category → {yearA, yearB, deltaPct}) y orquesta cuatro bloques: KPI cards, gráfico de barras agrupadas, tabla por categoría/proveedor y selector de años. `recharts` se importa vía `next/dynamic({ ssr: false })` para no contaminar el bundle inicial ni forzar SSR de SVG.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|---|---|---|---|
| Aggregation location | Pure functions in `lib/comparativos/aggregation.ts` | Compute in component | Pure functions son testeables sin DOM y reutilizables para futuros exports |
| Year selector UI | Two independent shadcn `Select` (Año A / Año B) | Single "pair" dropdown | Más flexible (cambiar un año no fuerza el otro) y reusa el `Select` ya instalado |
| Year option source | Set of years derived from `expenses.map(issueDate → year)`, sorted desc | Hardcoded range | Datos mock pueden crecer; derivar evita acoplar la UI al dataset |
| Default year pair | Most recent year in data vs previous one | Hardcoded "2024 vs 2025" | Cuando se añadan 2025/2026 al mock, el default se actualiza solo |
| Chart loading | `next/dynamic(import('./comparativos-chart'), { ssr: false, loading: <Skeleton/> })` | Static import, dynamic SSR only | `recharts` mide ~100KB gzipped; lazy + no-SSR evita mismatch de hidratación |
| Chart type | `BarChart` grouped (`<Bar dataKey="yearA" />` + `<Bar dataKey="yearB" />`) | LineChart, stacked bars | Grouped bars muestran comparación directa por categoría, lo que pide el proposal |
| State management | `useState` en el workspace + `useMemo` para agregaciones | URL search params, server actions | Scope pequeño y mock; URL params se puede añadir después sin refactor |
| Money + categories | Reusar `formatCentsToEuros` (inline en page) y `CATEGORY_OPTIONS` de `provider-filters.tsx` | Duplicar en módulo propio | Una sola fuente de verdad; evita drift entre vistas |

## Data Flow

```
app/comunidades/[id]/comparativos/page.tsx   (server)
    │
    ├── COMUNIDADES.find(id) → community
    ├── GASTOS.filter(communityId)  → expenses
    │
    ▼
<MainContent title="Comparativos — {community.name}">
    <ComparativosWorkspace expenses={...} />
        │                                       (client)
        ├── useState<{ yearA, yearB }>          (defaults: derived)
        ├── useMemo → aggregateByYear / byCategory / byProvider
        ├── <ComparativosYearSelector .../>     (two Selects)
        ├── <ComparativosMetrics .../>          (totals, %Δ, biggest mover)
        ├── next/dynamic(() => import('./comparativos-chart'))
        │       └── <BarChart data={categoryData} .../>
        └── <ComparativosTable rows={...} />
```

## File Changes

| File | Action | Description |
|---|---|---|
| `app/comunidades/[id]/comparativos/page.tsx` | Create | Server component: `notFound` si no existe comunidad, filtra `GASTOS`, monta workspace dentro de `MainContent` |
| `app/comunidades/[id]/comparativos/comparativos.module.css` | Create | Estilos de page-level (header, mock warning) |
| `components/comunidades/comparativos/comparativos-workspace.tsx` | Create | Client. State del par de años, `useMemo` con agregaciones, orquesta children |
| `components/comunidades/comparativos/comparativos-chart.tsx` | Create | Client. `BarChart` recharts: 5 categorías × 2 barras (yearA, yearB). Props tipadas |
| `components/comunidades/comparativos/comparativos-table.tsx` | Create | Client. Filas por categoría + filas por proveedor, columna `Δ%` con clases semánticas |
| `components/comunidades/comparativos/comparativos.module.css` | Create | Grid 12-cols, KPI cards, tabla zebra, mock warning |
| `components/comunidades/comparativos/comparativos-skeleton.tsx` | Create | Loading state para `next/dynamic` |
| `lib/comparativos/aggregation.ts` | Create | Puras: `aggregateByYear`, `aggregateByCategory`, `aggregateByProvider`, `biggestMover`, `computeDeltaPct` (guard div-by-zero) |
| `lib/comparativos/aggregation.test.ts` | Create | Tests unitarios de las funciones puras (sigue patrón de `filter-logic.js`) |
| `types/comparativos.ts` | Create | `YearTotal`, `CategoryComparison`, `ProviderComparison`, `ComparisonRow`, `YearSelection` |
| `data/proveedores.ts` | Modify | Añadir gastos 2023 (12 meses, todas las categorías) y 2025 (YTD) para `com-001`..`com-004`. Prerequisito antes de UI |
| `app/comunidades/[id]/page.tsx` | Modify | Añadir `<Link href="./comparativos">` en el header con icono `lucide-react` (BarChart3) |
| `app/comunidades/[id]/community-detail.module.css` | Modify | Estilo del nav-link (consistente con `.backLink`) |
| `package.json` | Modify | `recharts` dependency (requiere aprobación explícita del usuario, según `AGENTS.md`) |
| `openspec/changes/comparativos/spec.md` | **NOT created** | No existe; el proposal es la fuente de verdad. sdd-spec lo cubrirá en su fase |

## Interfaces / Contracts

```ts
// types/comparativos.ts
export interface YearTotal { year: number; totalCents: number; count: number; }
export interface CategoryComparison {
  category: ProviderExpenseCategory;
  label: string;             // "Limpieza", "Mantenimiento", ...
  yearACents: number; yearBCents: number; deltaPct: number | null;
}
export interface ProviderComparison {
  providerId: string; businessName: string;
  yearACents: number; yearBCents: number; deltaPct: number | null;
}
export interface YearSelection { yearA: number; yearB: number; }

// lib/comparativos/aggregation.ts (shape)
export function aggregateByYear(expenses: ProviderExpense[]): YearTotal[];
export function aggregateByCategory(expenses: ProviderExpense[], sel: YearSelection): CategoryComparison[];
export function aggregateByProvider(expenses: ProviderExpense[], sel: YearSelection): ProviderComparison[];
export function biggestMover(rows: CategoryComparison[]): CategoryComparison | null;
export function computeDeltaPct(a: number, b: number): number | null; // null when a === 0
```

## Testing Strategy

| Layer | What | Approach |
|---|---|---|
| Unit | `aggregation.ts`: deltas con zero, biggestMover con empate, año sin gastos | `lib/comparativos/aggregation.test.ts` (mismo runner que `filter-logic.js`) |
| Visual | Comparativos con comunidades `com-001` (full data) vs `com-004` (caso con 2023 parcial) | `playwright` snapshot contra `app/comunidades/com-001/comparativos` |
| Empty | Comunidad sin `GASTOS` → mensaje claro en metrics + chart + table | Snapshot con `prov-013` reference o mock de comunidad vacía |

## Migration / Rollout

Sin migración. Cambios aditivos: nueva ruta + nuevos componentes + `package.json` (+1 dep). Rollback = borrar `app/comunidades/[id]/comparativos/`, `components/comunidades/comparativos/`, `lib/comparativos/`, `types/comparativos.ts`, revertir nav-link, revertir `recharts` (ver proposal §Rollback Plan).

## Open Questions

- [ ] ¿La usuaria espera poder ver **trimestres** dentro del año (Q1 vs Q1) además de año completo? El proposal no lo menciona, pero es una pregunta natural para validar.
- [ ] ¿El KPI "biggest mover" debe ser absoluto (€) o porcentual (Δ%)? El proposal no lo específica. Recomendado: **€ absoluto** (más intuitivo para gestor).
- [ ] ¿Debe haber un mock-warning persistente además de la label? El proposal sugiere solo label; suficiente para v1.
- [ ] Dependencia `recharts` requiere aprobación explícita del usuario antes de `npm install` (regla de `AGENTS.md`).
