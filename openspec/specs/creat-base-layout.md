# Crear layout base de Fincas Pro

## 1. Objetivo

Crear el layout visual base de Fincas Pro para el prototype frontend.

El layout debe dar una estructura clara para la aplicación: navegación lateral, topbar con buscador global mock y un área principal donde más adelante se montarán las pantallas. Debe transmitir una herramienta profesional, sobria, rápida y orientada al trabajo diario de administración de fincas.

## 2. Alcance

- Sidebar lateral fijo en escritorio.
- Topbar con buscador global mock.
- Área principal de contenido.
- Navegación visual con estas secciones:
  - Dashboard
  - Comunidades
  - Propietarios
  - Recibos
  - Proveedores
  - Bancos
  - Liquidaciones
  - Comunicaciones
  - Informes
  - Configuración
- Estilo coherente con `docs/03-diseno/README.md`:
  - Sobrio.
  - Profesional.
  - Denso sin ser confuso.
  - Orientado a velocidad y claridad.
  - Jerarquía visual simple.
- Navegación estática/mock, sin comportamiento real.
- Preparar una base visual reutilizable para futuras pantallas.

## 3. Fuera de alcance

- Backend real.
- Base de datos.
- Prisma, migraciones o modelos persistentes.
- Autenticación.
- Datos reales de clientes.
- Norma 43.
- Norma 19.
- Emails reales.
- Cartas reales.
- Flujos legales reales.
- Pantallas completas de módulos.
- Filtros funcionales.
- Buscador funcional.
- Exportaciones reales.
- Nuevas dependencias.
- Cambios de configuración del proyecto.

## 4. Archivos probables

> Estos archivos son probables para la futura implementación, no para esta spec.

- `docs/specs/create-base-layout.md` — especificación de esta tarea.
- `app/layout.tsx` — layout raíz si ya existe estructura Next.js.
- `app/page.tsx` — página inicial o placeholder si aplica.
- `components/layout/app-shell.tsx` — estructura general del layout.
- `components/layout/sidebar.tsx` — navegación lateral.
- `components/layout/topbar.tsx` — barra superior con buscador mock.
- `components/layout/main-content.tsx` — contenedor principal.
- `lib/navigation.ts` o `data/navigation.ts` — definición mock de secciones de navegación.

Si la estructura Next.js todavía no existe, la implementación deberá parar y pedir aprobación antes de crear estructura de aplicación o tocar configuración.

## 5. Tareas pequeñas

1. Revisar la estructura actual del proyecto antes de implementar.
2. Definir la lista estática de navegación.
3. Crear el contenedor base del layout.
4. Crear la sidebar fija de escritorio.
5. Crear la topbar con buscador global mock.
6. Crear el área principal de contenido con placeholder simple.
7. Aplicar estilo visual coherente con la guía de diseño.
8. Verificar que no se añade lógica real, backend, auth, base de datos ni dependencias.
9. Revisar diff antes de cerrar la tarea.

## 6. Criterios de aceptación

- La aplicación muestra una estructura base con sidebar, topbar y contenido principal.
- La sidebar aparece fija en escritorio.
- La navegación muestra todas las secciones definidas en el alcance.
- El buscador global existe visualmente pero no ejecuta búsquedas reales.
- El área principal está preparada para alojar futuras pantallas.
- El estilo es sobrio, profesional y claro.
- No hay backend, auth, base de datos ni datos reales.
- No se instalan dependencias.
- No se modifica configuración sin aprobación.
- No se implementan pantallas completas todavía.
- Los datos mock o constantes de navegación quedan separados de la UI cuando corresponda.

## 7. Riesgos o dudas

- Puede que todavía no exista estructura Next.js real en el repositorio; si falta, no debe crearse sin aprobación explícita.
- El comportamiento responsive/mobile no está definido todavía.
- La navegación puede ser solo visual o enlazar a rutas futuras; esta decisión debe confirmarse antes de implementar rutas.
- Si `lucide-react` no está instalado, no deben añadirse iconos nuevos mediante dependencia sin aprobación.
- El diseño visual inicial es una referencia, no una especificación definitiva.
- El buscador global debe mantenerse claramente como mock para no simular funcionalidad real.
