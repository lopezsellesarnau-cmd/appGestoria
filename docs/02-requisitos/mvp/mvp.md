# MVP provisional

## Hipótesis

El MVP inicial debe priorizar rendimiento, vistas contables flexibles y automatización operativa porque ahí está el apalancamiento real para reducir horas-hombre y riesgo de error.

Sin resolver rendimiento, mayorías contables (propietarios/proveedores), automatización documental y filtros fiscales, cualquier nueva app para administradores de fincas replicará el mismo dolor con otra interfaz.

Esta hipótesis no es definitiva. Debe validarse con la usuaria antes de construir funcionalidades reales complejas.

> **Nota sobre simplificación operativa:** Las capturas del sistema actual sugieren que simplificar la gestión operativa (incidencias/siniestros) unificando pestañas en una sola vista limpia podría ofrecer tanto o más valor inicial que la propia contabilidad.

## MVP inicial posible (basado en análisis de la Gestora)

El MVP debe cubrir el núcleo contable diario que actualmente causa fricción. Alcance ordenado por prioridad:

### Fase 1 — Núcleo contable (lo más doloroso)

- **Comunidades:** alta con grupos de reparto y coeficientes de escritura.
- **Mayores de propietarios — modo dual:**
  - Vista combinada: ordinarios + extraordinarios en un solo mayor.
  - Vistas separadas: mayores independientes para ordinario y extraordinario.
- **Mayores de proveedores:** con filtrado por fechas y por comunidad.
- **Señalización de deuda judicializada:** color/etiqueta para importes reclamados.
- **Deudores:** listado con importes pendientes y umbral de impagos visible.

### Fase 2 — Fiscalidad y reporting

- **Filtro modelo 347:** consulta por ejercicio para proveedores con facturación > 3.001 €.
- **Comparativos:** gastos interanualales y presupuesto vs. ejecutado por comunidad y capítulo.

### Fase 3 — Automatización operativa

- **Recordatorios automáticos de cuotas:** tras 2–3 recibos impagados.
- **Correspondencia masiva personalizada:** combinación de correspondencia por propietario (mail + carta).
- **Envío de emails integrado** (reducir dependencia de Galvi/colegio).

### Fase 4 — Gestión integral del edificio

- Incidencias y siniestros (con flujos de estado: Pendiente → Resuelto → Cerrado).
- Obras, mantenimientos, contratos, inventario, presupuestos, inspecciones.

## Objetivo del MVP

- Reducir tiempo de consulta.
- Mejorar búsqueda y filtros.
- Facilitar listados frecuentes.
- Validar el flujo real antes de invertir en backend, auth o reglas complejas.
- Evitar que el prototipo replique la lentitud y la falta de visibilidad del programa actual.

## Requisitos candidatos a validar

Estos puntos aparecen en el descubrimiento, pero no son todavía alcance cerrado del MVP.

- Mayores de propietarios con vista combinada de ordinarios y extraordinarios.
- Mayores de propietarios con vistas separadas para ordinario y extraordinario.
- Mayores de proveedores filtrados por fechas y comunidad.
- Señalización visual de deuda reclamada judicialmente.
- Filtros relacionados con Modelo 347 por ejercicio e importe, con umbral pendiente de validar.
- Comparativos de gastos entre ejercicios.
- Comparativa de presupuesto frente a gasto real.
- Grupos de reparto y coeficientes.
- Presupuesto anual.
- Liquidación trimestral.
- Recordatorios de cuotas a deudores.
- Correspondencia personalizada.
- Gestión de incidencias, siniestros, contratos, obras, mantenimientos e inspecciones.

### Modelo de Datos Operativo (Basado en el sistema legacy)

Si se aborda la Gestión Integral, la base de datos debe soportar los siguientes datos operativos:

**Trazabilidad Común:**
- Estados: Pendiente, Resuelto, Cerrado, Acuerdo junta.
- Histórico de acciones con fecha y operario.
- Bloque de Notas de tamaño suficiente.

**Datos de Incidencias/Obras:**
- Comunicante (persona que reporta).
- Proveedor asignado.
- Tipo de avería.
- Urgencia.
- Tiempos de resolución: Fechas de aviso, inicio y fin.

**Datos de Siniestros:**
- Compañía aseguradora.
- Póliza.
- Nº de Siniestro.
- Franquicia.
- Datos del Perito y del Corredor.
- Fechas de peritaje y liquidación.

**Datos de Contratos:**
- Fechas de vigencia.
- Días de preaviso.
- Coste anual.
- Forma de pago.

**Funcionalidades transversales a validar:**
- Adjuntar documentos nativamente desde la ficha.
- Envío de comunicaciones (Email/SMS) desde la propia ficha.

## Fuera del MVP inicial

- Norma 43 real.
- Norma 19 real.
- Emails reales.
- Cartas legales reales.
- Contabilidad avanzada.
- Liquidaciones definitivas.
- Auth y permisos avanzados.
- Datos reales.
- Base de datos definitiva.
- Automatizaciones legales o bancarias reales.
- KPIs de rendimiento definitivos.
- Arquitectura de jobs, colas o procesos backend.

## Criterio de entrada al MVP

Una funcionalidad solo debería entrar si ayuda a validar una tarea frecuente o dolorosa de la usuaria inicial.

Si no se puede explicar qué problema concreto valida, queda fuera.

## Criterio de cuidado

Que algo aparezca en el descubrimiento no significa que deba implementarse ya.

Primero se valida el flujo real. Después se decide qué entra en la primera versión.
