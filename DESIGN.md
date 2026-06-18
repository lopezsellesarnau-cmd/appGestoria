---
name: Modern Administration System
colors:
  surface: '#fbf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fbf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f4'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e3'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45474c'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#545f73'
  primary: '#091426'
  on-primary: '#ffffff'
  primary-container: '#1e293b'
  on-primary-container: '#8590a6'
  inverse-primary: '#bcc7de'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#201100'
  on-tertiary: '#ffffff'
  tertiary-container: '#3c2300'
  on-tertiary-container: '#c88000'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e3fb'
  primary-fixed-dim: '#bcc7de'
  on-primary-fixed: '#111c2d'
  on-primary-fixed-variant: '#3c475a'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#fbf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e3'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  table-data:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  unit-1: 0.25rem
  unit-2: 0.5rem
  unit-4: 1rem
  unit-6: 1.5rem
  unit-8: 2rem
  sidebar-width: 260px
  container-max: 1440px
  gutter: 16px
---

## Brand & Style

The design system is engineered for the high-stakes environment of Spanish property management and accounting. It targets professional *Administradores de Fincas* and legal clerks who require a high-efficiency tool that balances extreme data density with cognitive clarity.

The aesthetic follows a **Modern Corporate** direction—drawing inspiration from high-end financial ERPs. It prioritizes utility, speed, and precision. By utilizing generous white space between functional modules and a strict adherence to a grid, the design system eliminates the "clunkiness" of legacy software, replacing it with a lightweight, performance-oriented interface that feels robust and dependable.

## Colors

The palette is rooted in professional stability and semantic clarity.

- **Primary (Navy Blue):** Used for navigation, structural headers, and primary actions. It establishes authority and focus.
- **Success (Emerald Green):** Reserved for positive financial states (*Pagado*, *Conciliado*).
- **Warning (Amber):** Used for pending states and minor arrears (*Pendiente*).
- **Alert (Red):** Dedicated to high-priority debt and legal cases (*Reclamado*, *Judicializado*).
- **Neutral/Background:** A sophisticated layering of light grays ensures that the interface remains easy on the eyes during long working hours, while pure white surfaces indicate interactive or editable areas.

## Typography

This design system utilizes a dual-font approach to maximize readability for both prose and numerical data. 

**Geist** is used for headlines, labels, and tabular data. Its technical, precise nature makes it ideal for the monospaced-like clarity required in accounting entries and financial figures. **Inter** is used for standard body text and descriptions, providing a neutral, humanist touch that ensures long-form legibility.

Data-heavy views utilize the `table-data` style, which uses a slightly tighter size and medium weight to ensure that large balance sheets remain readable without excessive scrolling.

## Layout & Spacing

The design system employs a **12-column fluid grid** for dashboard views and a **fixed grid** for centered detail pages. 

- **Sidebar:** A fixed 260px navy sidebar houses the primary navigation.
- **Data Density:** Layouts use a high-density spacing model (4px base) to allow more information on-screen, critical for managing multiple properties simultaneously.
- **Margins:** 24px (unit-6) horizontal margins on desktop, scaling down to 16px (unit-4) on mobile.
- **Gutters:** Standard 16px gutters between cards and table columns to maintain separation without wasting space.

## Elevation & Depth

To maintain a "fast and lightweight" feel, this design system avoids heavy shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**.

1.  **Level 0 (Canvas):** Background (`#f8fafc`).
2.  **Level 1 (Cards/Tables):** White surface (`#ffffff`) with a 1px border in `#e2e8f0`.
3.  **Level 2 (Active/Hover):** Subtlest possible shadow (0px 1px 3px rgba(0,0,0,0.05)) to indicate interactivity.
4.  **Level 3 (Modals/Overlays):** Medium-diffusion shadow to focus the user on critical accounting corrections or "Asiento Contable" entries.

Zebra striping in tables uses `#f1f5f9` on alternate rows to guide the eye across wide financial data points.

## Shapes

The shape language is "Soft" (0.25rem/4px). This slight rounding provides a modern, approachable feel while maintaining the rigid, professional structure expected of a financial tool. 

- **Inputs and Buttons:** 4px radius.
- **KPI Cards:** 8px radius (rounded-lg) to distinguish them as high-level summary containers.
- **Status Chips:** Full "pill" rounding (rounded-xl) to make them instantly recognizable as status indicators against the sharp corners of the data tables.

## Components

### Sidebar Navigation
The primary navigation uses the Navy Blue (#1e293b) background. Active states should use a subtle left-accent border in Emerald Green (#10b981) with a white text treatment. Icons should be line-art style (e.g., Lucide or Phosphor) for clarity.

### Data Tables
Tables are the heart of the system.
- **Header:** Light gray background (#f1f5f9), bold labels in Spanish (e.g., *PROPIETARIO*, *COUTA*, *ESTADO*).
- **Cells:** Use `table-data` typography. Numerical values should be right-aligned to allow for easy decimal comparison.
- **Borders:** Horizontal-only borders to reduce visual noise.

### Status Chips (Badges)
- **Pagado:** Green background (10% opacity) with Green text.
- **Pendiente:** Orange background (10% opacity) with Orange text.
- **Reclamado/Judicializado:** Red background (10% opacity) with Red text.

### KPI Cards
Summary boxes at the top of dashboards. They feature a large Geist-font figure, a small label in Spanish (e.g., *Saldo Total*), and a subtle 1px border.

### Buttons & Inputs
- **Primary Action:** Solid Navy Blue with white text and a leading icon.
- **Secondary Action:** Ghost style (border only) for *Exportar* or *Filtrar*.
- **Global Search:** Positioned in the top header, utilizing a magnifying glass icon and a keyboard shortcut hint (e.g., "⌘ K").

### Tab Systems
Underlined style for switching between complex views (e.g., *Gastos*, *Ingresos*, *Presupuesto*). The active tab uses a 2px Emerald Green underline.