# Design Doc: Migración a Tailwind + Sistema de Diseño

**Fecha**: 2026-06-10
**Estado**: Aprobado
**Autor**: Equipo de desarrollo

---

## 1. Resumen

Migrar la app de CSS Modules a **Tailwind CSS** + **shadcn/ui** e implementar un sistema de diseño propio para gestoría. El objetivo es resolver los problemas de jerarquía visual, legibilidad de tablas y consistencia que tiene la UI actual.

---

## 2. Paleta de colores

### Colores principales

| Token | Hex | Uso |
|-------|-----|-----|
| `primary` | `#1e3648` | Acentos, elementos interactivos, sidebar activo |
| `primary-foreground` | `#ffffff` | Texto sobre primary |
| `background` | `#f8f7f4` | Fondo de página (warm stone) |
| `surface` | `#ffffff` | Cards, tablas, elementos elevados |
| `border` | `#e2e0dc` | Bordes de cards, tablas, separadores |
| `muted` | `#f1f0ec` | Header de tablas, fondos sutiles |
| `muted-foreground` | `#5a5a6e` | Texto secundario, labels |
| `foreground` | `#1a1a2e` | Texto principal |
| `secondary` | `#64748b` | Texto de soporte, info |

### Colores de estado

| Estado | Hex | Uso |
|--------|-----|-----|
| `success` | `#0d9488` | Pagado, al día, positivo |
| `warning` | `#d97706` | Pendiente, precaución |
| `destructive` | `#e11d48` | Vencido, error, deuda |
| `info` | `#64748b` | Informativo, neutral |

### Sidebar

| Token | Hex | Uso |
|-------|-----|-----|
| `sidebar-bg` | `#0f1a24` | Fondo del sidebar |
| `sidebar-foreground` | `#ffffff` | Texto del sidebar |
| `sidebar-muted` | `#94a3b8` | Texto secundario en sidebar |

---

## 3. Tipografía

### Familia

- **Display/Headlines**: `Geist` — números tabulares, limpio
- **Body**: `Inter` — alta legibilidad en pantallas

### Tokens

| Token | Familia | Peso | Tamaño | Uso |
|-------|---------|------|--------|-----|
| `heading-xl` | Geist | 600 | 28px | Título de página |
| `heading-lg` | Geist | 600 | 22px | Título de sección |
| `heading-md` | Geist | 500 | 18px | Título de card/panel |
| `body-lg` | Inter | 400 | 16px | Texto de lectura |
| `body-md` | Inter | 400 | 14px | Contenido general |
| `body-sm` | Inter | 400 | 12px | Metadatos, fechas |
| `table-header` | Geist | 500 | 13px | Encabezados de tabla |
| `table-cell` | Geist | 400 | 14px | Celdas de tabla (tabular figures) |
| `label-sm` | Inter | 500 | 12px | Labels de formulario |

---

## 4. Componentes shadcn/ui

### Componentes a instalar

```
table, card, badge, button, input, select, separator, skeleton
```

### Componentes para futuras fases

```
dialog, dropdown-menu, tabs
```

---

## 5. Layout

### Estructura

```
┌──────────┬─────────────────────────────────────────┐
│          │  Topbar: bg white, borde inferior #e2e0dc│
│ Sidebar  ├─────────────────────────────────────────┤
│ bg: #0f1a24│  Main: bg #f8f7f4, padding 24px       │
│          │  max-width 1440px                        │
│ texto    │                                          │
│ blanco   │  Cards/tablas: bg white, borde #e2e0dc    │
└──────────┴─────────────────────────────────────────┘
```

### Sidebar
- Fondo oscuro `#0f1a24`
- Navegación con icono + texto
- Ítem activo: fondo `#1e3648`
- Hover: fondo sutil

### Topbar
- Fondo blanco con borde inferior `#e2e0dc`
- Título de página actual
- Sin sombra

### Main
- Fondo cálido `#f8f7f4`
- Contenido en cards flotantes con borde

---

## 6. Tablas

### Estructura

```
┌──────────────────────────────────────────────────────┐
│ Table Header: bg #f1f0ec, borde bottom #d4d1cb       │
│ Texto: Geist 500, uppercase o small-caps             │
├──────────┬──────────────┬──────────┬────────────────┤
│ Comunidad│  Dirección   │  Estado  │  Deuda         │
├──────────┼──────────────┼──────────┼────────────────┤
│ Los Pinos│  C/ Mayor 12 │ [Badge]  │    1.250,00 €  │
├──────────┼──────────────┼──────────┼────────────────┤
│ El Roble │  Av. Sol 5   │ [Badge]  │      430,50 €  │
└──────────┴──────────────┴──────────┴────────────────┘
```

### Reglas

| Elemento | Tratamiento |
|----------|-------------|
| Header | bg `#f1f0ec`, texto uppercase, Geist 500 |
| Fila | Borde bottom `#e2e0dc` entre filas |
| Hover | bg `#f1f0ec` en la fila |
| Números | Alineados derecha, Geist tabular figures |
| Padding | 12px vertical, 16px horizontal |

---

## 7. Badges de estado

### Variantes

| Estado | Fondo | Texto | Borde |
|--------|-------|-------|-------|
| Pagado | `#0d9488/10` | `#0d9488` | `#0d9488/20` |
| Pendiente | `#d97706/10` | `#d97706` | `#d97706/20` |
| Vencido | `#e11d48/10` | `#e11d48` | `#e11d48/20` |
| Activo | `#64748b/10` | `#64748b` | `#64748b/20` |

---

## 8. Plan de migración

### Fase 1 — Fundaciones
- [ ] Instalar Tailwind CSS
- [ ] Configurar `tailwind.config.ts` con tokens
- [ ] Instalar shadcn/ui CLI
- [ ] Agregar componentes: Button, Card, Badge, Separator
- [ ] Migrar `globals.css` a Tailwind

### Fase 2 — Layout (pilot)
- [ ] Migrar AppShell, Sidebar, Topbar
- [ ] Aplicar nueva paleta
- [ ] Verificar funcionalidad

### Fase 3 — Página piloto (Comunidades)
- [ ] Tabla con shadcn/ui Table
- [ ] Badges de estado
- [ ] Search y filtros

### Fase 4 — Resto de páginas
- [ ] Propietarios
- [ ] Recibos
- [ ] Proveedores

### Fase 5 — Polish
- [ ] Consistencia entre páginas
- [ ] Skeleton loaders
- [ ] Revisión responsive

---

## 9. Lo que NO cambia

- Datos mock (siguen en `/lib/mock/`)
- Lógica de negocio
- Rutas y navegación
- Estructura de archivos de páginas

---

## 10. Decisiones tomadas

1. **Tailwind + shadcn/ui** — mejor mantenibilidad y componentes pre-construidos
2. **Paleta propia** — no Material 3 genérico, colores pensados para gestoría
3. **Geist + Inter** — excelente para tablas con números tabulares
4. **Migración incremental** — fases con commits separados para reducir riesgo
5. **Badges con opacidad** — visibles pero no agresivos

---

## 11. Limitaciones conocidas

### Geist Font

**Problema**: Geist no está disponible vía `next/font/google` como paquete estándar. La fuente es propiedad de Vercel y no se distribuye como paquete npm público.

**Solución temporal**: Se carga Geist desde el CDN de Google Fonts (fuente: Vercel):
```html
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap" rel="stylesheet" />
```

**Solución recomendada para producción**:
1. Descargar los archivos de fuente desde https://vercel.com/font/geist
2. Colocar los archivos `.woff2` en `public/fonts/geist/`
3. Usar `next/font` con archivos locales:
   ```typescript
   import { Geist } from "next/font/local"
   ```
4. Actualizar `tailwind.config.ts` para usar la variable CSS de la fuente local

**Impacto**: La carga desde CDN significa que Geist no se optimiza automáticamente con `next/font` (sin subconjuntos, sin auto-descarga). Para una app en producción con mucho tráfico, se recomienda la solución local.
