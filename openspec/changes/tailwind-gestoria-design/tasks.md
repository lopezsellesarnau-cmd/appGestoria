# Tasks: Tailwind + shadcn/ui Migration

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 600–900 (installs, config, component rewrites, CSS Modules removal) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (Foundation) → PR 2 (Layout pilot) → PR 3 (Comunidades) → PR 4 (Rest of pages) → PR 5 (Polish) |
| Delivery strategy | exception-ok |
| Chain strategy | size-exception |

**Note**: Single PR with size:exception approved by user.

---

## Phase 1: Foundation

- [x] 1.1 Install Tailwind CSS (`npm install -D tailwindcss postcss autoprefixer`) and run `npx tailwindcss init -p`
- [x] 1.2 Configure `tailwind.config.ts` — add `content: ["./app/**/*", "./components/**/*", "./lib/**/*"]` and extend theme with gestoría color tokens (primary, background, surface, border, muted, sidebar palette) and font families (Geist, Inter)
- [x] 1.3 Install shadcn/ui CLI (`npx shadcn@latest init`) with defaults; set `@/components/ui` component path
- [x] 1.4 Add shadcn components: `npx shadcn@latest add button card badge separator table input select skeleton`
- [x] 1.5 Migrate `app/globals.css` — replace CSS Module imports with `@tailwind base/components/utilities`; move CSS custom properties (existing vars) to `:root` under Tailwind's `tailwind.config.ts` `--tw-*` equivalent tokens; remove old `*.module.css` imports from `app/layout.tsx`

---

## Phase 2: Layout Pilot

- [x] 2.1 Read `components/layout/AppShell.tsx` and `*.module.css`; extract current layout logic (sidebar + topbar + main)
- [x] 2.2 Rewrite `components/layout/Sidebar.tsx` — apply sidebar dark palette (`#0f1a24` bg, white text, `#1e3648` active item, hover state), icon + text nav items using Tailwind classes
- [x] 2.3 Rewrite `components/layout/Topbar.tsx` — white bg, `#e2e0dc` bottom border, page title slot
- [x] 2.4 Rewrite `components/layout/AppShell.tsx` — compose Sidebar + Topbar + main slot; apply `#f8f7f4` warm background to main area; verify routing and navigation still work end-to-end

---

## Phase 3: Comunidades Page Pilot

- [x] 3.1 Replace table `div` structure in `app/comunidades/page.tsx` with shadcn/ui `Table`, `TableHeader`, `TableRow`, `TableHead`, `TableBody`, `TableCell` components
- [x] 3.2 Add shadcn `Badge` to status column — green `#0d9488` for "Pagado", amber `#d97706` for "Pendiente", red `#e11d48` for "Vencido"; apply `variant="outline"` with custom class
- [x] 3.3 Add `Input` (Search) and `Select` (Status filter) from shadcn to the filter bar above the table
- [x] 3.4 Apply table row styles — `bg #f1f0ec` table header, `border-b #e2e0dc` rows, hover `bg #f1f0ec` on row; right-align numeric cells with tabular figures via `font-variant-numeric: tabular-nums`

---

## Phase 4: Remaining Pages

- [x] 4.1 Apply Phase 3 table pattern to `app/propietarios/page.tsx` — shadcn Table + status Badge + filter bar
- [x] 4.2 Apply Phase 3 table pattern to `app/recibos/page.tsx` — shadcn Table + status Badge + filter bar (via ReceiptWorkspace components)
- [x] 4.3 Apply Phase 3 table pattern to `app/proveedores/page.tsx` — shadcn Table + status Badge + filter bar (via ProviderWorkspace components)
- [ ] 4.4 Remove unused `*.module.css` files from migrated pages (`comunidades.module.css`, `propietarios.module.css`, `recibos.module.css`, `proveedores.module.css`) only after all four pages are migrated and verified working

**Note**: CSS module files remain for now to allow easy rollback if needed. The workspace components still use CSS modules internally.

---

## Phase 5: Polish

- [x] 5.1 Audit all pages for consistency — ensure same table row heights, badge sizes, font sizes, spacing; align typography tokens from design doc
- [ ] 5.2 Add shadcn `Skeleton` loaders to table bodies during data loading state on all migrated pages
- [ ] 5.3 Run browser dev server — verify layout, tables, badges, search, and filters at common viewport widths (mobile 375px, tablet 768px, desktop 1440px)

---

**Not in scope**: Mock data in `/lib/mock/`, business logic, route structure, page file organization.
