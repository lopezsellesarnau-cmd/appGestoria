# Design: CRUD Comunidades y Propietarios

## Technical Approach

Add four independent route pages (`/comunidades/nueva`, `/comunidades/[id]/editar`, `/propietarios/nuevo`, `/propietarios/[id]/editar`) hosting controlled form components. Two React Contexts (`CommunityContext`, `OwnerContext`) backed by `useReducer` own the in-memory mock state, initialized by `structuredClone` of `data/*.ts` arrays at provider mount. List and detail pages become client components and consume these contexts so mutations are visible within the session. Pure validation functions in `lib/{comunidades,propietarios}/validation.ts` run synchronously before dispatch; they return a flat `Record<string, string>` of field errors.

> **Note on proposal vs user request**: proposal suggests a single `DataContext` (`lib/data-context.tsx`); user-explicit instruction is two contexts (`contexts/CommunityContext.tsx` + `contexts/OwnerContext.tsx`). Following the user request.

## Architecture Decisions

| # | Decision | Choice | Alternative | Rationale |
|---|----------|--------|-------------|-----------|
| 1 | State container | Two separate contexts | Single `DataContext` | User-explicit; per-domain ownership; fewer re-renders; mirrors `data/{domain}.ts` split |
| 2 | Form engine | Local `useState` + pure validators | `react-hook-form` + `zod` | Proposal forbids new deps; only 4 small forms; validators are already pure |
| 3 | `shadcn/ui Form` | Skip (would force RHF+zod deps) | Install with lib deps | Deliver Form UX via `Label` + `Input` + `Textarea` + `Checkbox` + `Button` primitives |
| 4 | List/detail pages | Convert to client components reading context | Keep server components | Mutations must be visible in-session; static imports hide changes |
| 5 | ID generation | `crypto.randomUUID()` (browser-native) | `nanoid`, sequential | No new dep; sufficient for prototype |
| 6 | Soft-delete UI | `Dialog` (shadcn, AlertDialog semantics) | Native `confirm()` | User-explicit; consistent with app design language |
| 7 | Submit → navigate | `router.push()` to detail/list | Toast + stay | No toast lib; standard App Router pattern |
| 8 | Coeficiente error | Hard error if sum outside `100 ± 0.01`; submit blocked | Soft warning + allow | Spec is opinionated; warnings are scope creep |
| 9 | `?communityId` | `useSearchParams()` in owner-new page | Server `searchParams` prop | Page is `"use client"` to consume context |
| 10 | Active filter default | Hide `isActive=false` owners, toggle "Mostrar inactivos" | Always show with chip | Matches Spanish admin convention; toggle is one extra line |

## Data Flow

```
  [Form Page] --submit--> validate(formData, ctx) --ok--> dispatch(action)
                                                                 |
                                                                 v
                                                    [useReducer] -> state
                                                                 |
                                                                 v
                  [List/Detail/Edit pages]  <--consume-- [useCommunity/useOwner]
```

In-memory only. Reload resets to baseline mocks (acceptable per AGENTS.md "frontend prototype con datos mock").

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `types/comunidades.ts` | Modify | Add `cif`, `address`, `province`, `postalCode`, `phone`, `email`, `bankAccount`, `notes?`, `createdAt`, `updatedAt` |
| `types/propietarios.ts` | Modify | Add `nif`, `email?`, `phone?`, `coeficiente`, `bankAccount?`, `isActive`, `notes?`, `createdAt`, `updatedAt` |
| `data/comunidades.ts` | Modify | Populate new fields on existing 4 entries |
| `data/propietarios.ts` | Modify | Populate new fields; `isActive: true`; `coeficiente` summing ~100 per community (5 owners × 20% each) |
| `contexts/CommunityContext.tsx` | Create | `Provider` + `useReducer` + `useCommunity()` hook; actions `ADD` / `UPDATE` |
| `contexts/OwnerContext.tsx` | Create | Same shape; actions `ADD` / `UPDATE` / `DEACTIVATE` |
| `lib/comunidades/validation.ts` | Create | `validateCommunity(data) → Record<string, string>` |
| `lib/propietarios/validation.ts` | Create | `validateOwner(data, allOwners, editingId?)` incl. coeficiente sum |
| `components/comunidades/community-form.tsx` | Create | Controlled form, `initial?` + `onSubmit` props |
| `components/propietarios/owner-form.tsx` | Create | Same; includes `Select` for `communityId`, `Input type="number"` for `coeficiente` |
| `app/comunidades/nueva/page.tsx` | Create | `"use client"`; wraps `<CommunityForm>`; submit → add → `router.push("/comunidades")` |
| `app/comunidades/[id]/editar/page.tsx` | Create | `"use client"`; pre-populates; submit → update → list |
| `app/propietarios/nuevo/page.tsx` | Create | `"use client"`; `useSearchParams` for `communityId`; pre-selects community |
| `app/propietarios/[id]/editar/page.tsx` | Create | `"use client"`; pre-populates; "Desactivar" button → `Dialog` confirm |
| `app/comunidades/page.tsx` | Modify | Switch data source to `useCommunity()`; add "Nueva comunidad" button |
| `app/comunidades/[id]/page.tsx` | Modify | Add `"use client"`; switch to `useCommunity()` + `useOwner()`; add "Editar" + "Añadir propietario" links |
| `app/propietarios/page.tsx` | Modify | Switch to `useOwner()`; add "Nuevo propietario" + "Mostrar inactivos" toggle |
| `components/ui/{dialog,label,textarea,checkbox}.tsx` | Create | Installed via `npx shadcn@latest add dialog label textarea checkbox` |

## Interfaces / Contracts

```ts
// types/comunidades.ts (additive — full file extended)
export interface Community {
  id: string;
  name: string;
  municipality: string;
  cif: string;           // NEW Spanish CIF/NIF
  address: string;      // NEW
  province: string;     // NEW
  postalCode: string;   // NEW 5 digits
  phone: string;        // NEW
  email: string;        // NEW
  bankAccount: string;  // NEW ES IBAN
  notes?: string;
  createdAt: string;    // NEW ISO
  updatedAt: string;    // NEW ISO
}
```

```ts
// types/propietarios.ts (additive)
export interface Owner {
  id: string;
  displayName: string;
  unitReference: string;
  communityId: string;
  nif: string;            // NEW
  email?: string;
  phone?: string;
  coeficiente: number;    // NEW 0..100, 2 decimals
  bankAccount?: string;
  isActive: boolean;      // NEW soft-delete
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

```ts
// contexts/CommunityContext.tsx
export type CommunityAction =
  | { type: "ADD"; payload: Community }
  | { type: "UPDATE"; payload: Community };

export function useCommunity(): {
  communities: Community[];
  add: (c: Omit<Community, "id" | "createdAt" | "updatedAt">) => Community;
  update: (id: string, patch: Partial<Community>) => void;
  getById: (id: string) => Community | undefined;
};
```

```ts
// lib/propietarios/validation.ts — coeficiente sum
export function validateOwner(
  data: Omit<Owner, "id" | "createdAt" | "updatedAt">,
  allOwners: Owner[],
  editingId?: string,
): Record<string, string> {
  // ... per-field checks (nif regex, email, phone, iban, coeficiente 0..100) ...
  const peerActive = allOwners.filter(
    (o) => o.communityId === data.communityId && o.isActive && o.id !== editingId,
  );
  const newSum = peerActive.reduce((s, o) => s + o.coeficiente, 0) + data.coeficiente;
  if (Math.abs(newSum - 100) > 0.01) {
    errors.coeficiente = `La suma de coeficientes debe ser 100% (actual ${newSum.toFixed(2)}%)`;
  }
  return errors;
}
```

```ts
// Spanish format regexes (lib/comunidades/validation.ts)
const CIF_RE  = /^[A-HJNP-SUVW]\d{7}[0-9A-J]$/;   // CIF
const NIF_RE  = /^\d{8}[A-Z]$/;                    // DNI/NIF
const IBAN_RE = /^ES\d{22}$/;                      // ES IBAN
const CP_RE   = /^\d{5}$/;                         // postal code
const PHONE_RE = /^(?:\+34|0034)?\d{9}$/;          // phone
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Lint/Type | TypeScript strict, ESLint | `npx tsc --noEmit` + `npm run lint` clean |
| Build | Production build | `npm run build` succeeds |
| Manual — Community CRUD | Create → appears in list → edit → saves → reload resets to mocks | Browser walkthrough |
| Manual — Owner CRUD + coeficiente | Add owner with valid coef → block invalid sum → soft-delete → toggle "mostrar inactivos" | Browser walkthrough |
| Manual — Deep-link | `/propietarios/nuevo?communityId=com-001` pre-selects community | Browser walkthrough |

No test runner installed (per `openspec/config.yaml` `testing.layers`).

## Migration / Rollout

No data migration. Mock data files are the only persistent layer; originals stay in git history. Rollback: `git revert <commit>`. Documented behavior: form mutations live in session memory only; a hard refresh reverts to baseline mocks.

## Open Questions

- [ ] **`react-hook-form` + `zod`**: proposal forbids new deps; this design uses local state. Approve, or allow adding these libs so the shadcn `Form` component can be used directly?
- [ ] **Active-owner filter default**: design hides `isActive=false` with a toggle. Confirm vs always-visible-with-chip.
- [ ] **Coeficiente in community create**: communities carry no `coeficiente`; only owners do. Confirm no community-level sum check is needed at create time.
- [ ] **Owner reassignment**: design allows changing `communityId` in the edit form. Confirm vs restrict to original community (reassignment is the only path to fix a miscategorised owner).
