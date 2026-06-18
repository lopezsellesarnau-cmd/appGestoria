# Discovery

## Estado actual

Fase: descubrimiento inicial del problema y recopilación de requisitos.

Objetivo provisional: diseñar una aplicación web que facilite el trabajo diario de una gestora o administradora de fincas, sustituyendo o complementando un programa actual que resulta lento y limitado para consultar información.

Todavía no se ha validado el flujo real de trabajo ni se ha decidido el alcance de la primera versión. Antes de implementar, hace falta observar cómo usa actualmente el programa con casos reales.

## Persona usuaria inicial

- Amiga del usuario que trabaja en una gestoría / administración de fincas.
- Utiliza actualmente un programa de gestión contable y administrativa para comunidades de propietarios.
- Está pendiente concretar si habría más personas usuarias dentro de la gestoría.
- Está pendiente concretar si en algún futuro accederían propietarios.

## Problemas confirmados

### Lentitud general

La usuaria indica que el principal problema del software actual es la lentitud.

Inicialmente pensaban que podía deberse al internet o a algún problema interno, pero lo revisaron con el informático y comprobaron que todo funcionaba correctamente.

Además, otras personas usuarias del mismo programa también se quejan de la lentitud.

### Filtros y listados insuficientes

El programa actual no ofrece suficientes opciones de filtros y listados.

Los listados que sí proporciona son incompletos o demasiado básicos.

### Fricción UX y Sobrecarga Visual

Las capturas del sistema legacy confirman que la interfaz obliga a la usuaria a navegar entre excesivas pestañas para un solo flujo:

- General
- Histórico
- Documentos
- Afectados
- Gastos
- Correos

Esta fragmentación obliga a cambiar constantemente de contexto. Además, la entrada de datos de contactos está separada y requiere mucho trabajo manual disperso, multiplicando clics y carga cognitiva.

## Hipótesis inicial de valor

La primera ventaja real de una nueva herramienta puede no estar en automatizar desde el principio toda la contabilidad avanzada.

La hipótesis inicial es que el valor puede estar en ofrecer:

- Una experiencia rápida.
- Consultas y filtros flexibles.
- Listados útiles y exportables.
- Acceso claro a información de comunidades, propietarios, recibos y proveedores.
- Menos trabajo manual fuera del programa actual.

Esta hipótesis debe validarse cuando la usuaria enseñe el flujo real de trabajo.

## Funcionalidades mencionadas inicialmente

### Contabilidad y propietarios

- Mayor de propietarios con visualización de todos los recibos: ordinarios y extraordinarios.
- Mayor de propietarios separando recibos ordinarios de extraordinarios.
- Contabilización de gastos e ingresos.

### Proveedores

- Mayor de proveedores filtrado por fechas y comunidades.
- Consulta orientada al Modelo 347 para importes superiores al umbral aplicable.
- Está pendiente validar exactamente cómo necesita consultar el Modelo 347.

### Repartos

- Creación de grupos de reparto.
- Asociación de grupos de reparto a coeficientes de escritura.

### Bancos y recibos

- Adaptación o importación vinculada a Norma 43.
- Generación o gestión relacionada con Norma 19 y recibos domiciliados.
- Está pendiente concretar el formato bancario real que utiliza.

### Presupuestos y cierres

- Creación de presupuesto anual para propietarios.
- Creación y gestión de derramas.
- Liquidaciones de cierre de ejercicio ordinario y extraordinario.
- Liquidaciones trimestrales y anuales.
- Comparativa de gastos de comunidades entre ejercicios.
- Comparativa de gasto real frente al presupuesto solicitado.

### Comunicaciones

- Recordatorios de cuotas a deudores.
- Correspondencia para envío de liquidaciones.
- Posible envío de emails integrado, pendiente de validar.

### Gestión integral del edificio

- **Incidencias.** _(Visualmente Confirmado)_
- **Siniestros.** _(Visualmente Confirmado)_
- **Obras.** _(Visualmente Confirmado)_
- Mantenimientos.
- **Contratos.** _(Visualmente Confirmado)_
- Inventario.
- **Presupuestos.** _(Visualmente Confirmado)_
- Inspecciones.

## Qué necesitamos descubrir antes de diseñar el MVP

### Trabajo cotidiano

- Qué tareas realiza todos los días o todas las semanas.
- Qué consultas o listados utiliza con más frecuencia.
- Qué pasos son repetitivos o manuales.
- Qué documentos entrega o envía habitualmente.

### Dolor real

- En qué pantallas o procesos nota especialmente la lentitud.
- Qué filtros echa de menos exactamente.
- Qué listados actuales son demasiado básicos.
- Qué columnas o datos debería incluir cada listado.
- Qué errores o riesgos teme cometer con el programa actual.
- Averiguar cuántos de los campos de la interfaz actual (teléfonos de fax, departamentos, datos redundantes de corredores) son realmente obligatorios y cuántos se rellenan por costumbre o se dejan en blanco.

### Prioridad funcional

Clasificar cada necesidad como:

- Imprescindible: sin ello no podría trabajar en la primera versión.
- Muy útil: le ahorraría mucho tiempo, pero se puede añadir después.
- Deseable: mejora futura.
- No necesario: el programa actual lo tiene, pero apenas lo usa.

## Reunión o demostración pendiente

La usuaria se ha ofrecido a enseñar en persona cómo trabaja actualmente.

Esa demostración será la fuente principal para definir el producto. No debe cerrarse el MVP sin observar al menos un flujo real o ficticio completo.

## Flujo que conviene pedirle que muestre

Pedirle un caso real o ficticio completo de una comunidad:

1. Abrir una comunidad.
2. Consultar sus propietarios y coeficientes.
3. Localizar recibos ordinarios y extraordinarios de un propietario.
4. Registrar o consultar un gasto o proveedor.
5. Aplicar los filtros o sacar los listados que más utiliza.
6. Mostrar qué proceso va lento o resulta incómodo.
7. Sacar una liquidación, listado de deudores o informe habitual.
8. Mostrar qué termina haciendo fuera del programa: Excel, correo, documentos manuales u otras plataformas.

## Información a capturar durante la demo

Para cada tarea:

- Objetivo de la tarea.
- Datos de entrada.
- Pasos y pantallas actuales.
- Resultado final o documento producido.
- Tiempo aproximado.
- Puntos de fricción.
- Frecuencia: diaria, semanal, trimestral o anual.
- Prioridad que ella le da.
- Campos que la usuaria mira primero.
- Campos que sobran.
- Palabras exactas que usa para nombrar conceptos.
- Atajos o trucos que usa en el programa actual.
- Casos raros que aparecen a menudo.

## Tabla de observaciones para la demo

| Observación | Ejemplo |
| --- | --- |
| Qué quiere buscar | Todos los recibos extraordinarios pendientes de una comunidad |
| Qué filtro no tiene | Fecha, propietario, tipo de recibo, importe o proveedor |
| Qué listado necesita | Deudores, proveedores por importe o gastos por ejercicio |
| Qué tarda mucho | Abrir ficha, cargar recibos o generar informe |
| Qué exporta actualmente | Excel, PDF, CSV o correo |
| Qué sigue haciendo manual | Copiar datos, filtrar en Excel o enviar emails |

## Nota del análisis 06-04

El análisis del 06-04 refuerza que el cuello de botella no es solo funcionalidad, sino fricción operativa causada por un núcleo contable y de gestión lento, fragmentado y sin visibilidad rápida.

Ese análisis menciona como necesidades candidatas:

- Rendimiento como prioridad de producto.
- Mayores de propietarios con vista combinada y vista separada.
- Mayores de proveedores con filtros por fechas y comunidad.
- Señalización clara de deuda reclamada judicialmente.
- Filtros fiscales relacionados con Modelo 347, pendientes de validar.
- Comparativos interanualales y presupuesto frente a gasto real.
- Recordatorios y correspondencia personalizada.
- Soporte futuro para distintos modelos de comunidad.
- Gestión de incidencias, siniestros, contratos, obras, mantenimientos e inspecciones.

Estas necesidades no son compromisos de implementación. Son material de descubrimiento que debe validarse con la usuaria.

## Análisis detallado de la Gestora (documento de la usuaria)

La amiga que trabaja en la gestoría ha aportado el siguiente análisis sobre el funcionamiento real del despacho:

### Núcleo contable exigido por operación diaria

- **Norma 43:** importación, punteo y contabilización bancaria; archivo de facturas vinculado a movimientos.
- **Norma 19:** generación de remesas de cuotas de vecinos.
- **Mayores de propietarios — dos modos obligatorios:**
  - Vista combinada: ordinarios + extraordinarios en un solo mayor.
  - Vistas separadas: mayores independientes para ordinario y extraordinario.
- **Mayores de proveedores:** con filtrado por fechas y por comunidad.
- **Señalización de deuda judicializada:** destacar a simple vista importes reclamados (color/etiqueta).

### Fiscalidad y reporting sin Excel

- **Filtro modelo 347:** consulta por ejercicio para proveedores con facturación > 3.001 €.
- **Comparativos:** gastos interanualales y presupuesto vs. ejecutado por comunidad y capítulo, sin exportaciones manuales.

### Modelos de comunidades y reparto

- **Alta de comunidad:** creación de grupos de reparto y asociación a coeficientes de escritura.
- **Comunidades a presupuesto anual:** generación de presupuesto y prorrateo por coeficientes.
- **Comunidades a liquidación trimestral:** cálculo y emisión de liquidaciones periódicas.
- **Liquidación anual** para comunidades a presupuesto.

### Comunicaciones y automatización operativa

- **Recordatorios automáticos de cuotas:** disparo tras 2–3 recibos impagados con carta/aviso.
- **Correspondencia masiva personalizada:** combinación de correspondencia para enviar a cada propietario "lo suyo" (mail y opción carta).
- **Envío de emails integrado** para reducir dependencia de plataformas externas (Galvi/colegio).

### Gestión integral del edificio

- Incidencias y siniestros.
- Obras, mantenimientos, contratos, inventario.
- Presupuestos e inspecciones.
- Necesidad de clasificación clara y flujos definidos para cada tipo (estado, responsables, documentos).

### Diagnóstico de dolor actual

- **Fenómeno:** lentitud general del programa; tareas repetitivas y dispersión en plataformas externas.
- **Mecanismo:** vistas contables rígidas, falta de filtros/reportes nativos, nula automatización documental.
- **Impacto:** tiempo perdido en redacción manual, consultas proveedor a proveedor, Excel forzado y riesgo humano.

### Commitment de la Gestora (Próximos Pasos)

La usuaria ha definido los siguientes compromisos por área:

**@Product Manager**
- Definir requisitos funcionales "no negociables" (Norma 43/19, mayores duales, 347, comparativos, recordatorios, correspondencia, modelos de comunidad, grupos/coeficientes) en un PRD versionado.
- Especificar KPIs de rendimiento (p. ej., importación Norma 43 < 5s por 1.000 líneas; carga de mayor < 2s) para aceptar el release.

**@Arquitecto Técnico**
- Proponer arquitectura orientada a rendimiento (indexación contable, colas para correspondencia, jobs para recordatorios) con SLAs medibles.
- Diseñar modelo de datos para mayores con dimensiones: propietario, naturaleza (ordinaria/extraordinaria), comunidad, proveedor, ejercicio.

**@Equipo Backend**
- Implementar motores de importación Norma 43/19 con conciliación y trazabilidad, y API de mayores con filtros combinados/separados.
- Desarrollar endpoint de filtro 347 por ejercicio e importe con exportación CSV/PDF.
- Construir comparativos gasto vs. presupuesto e interanualuales con agregaciones por capítulo y comunidad.

**@Equipo Frontend**
- Entregar vistas de mayores: selector "combinado/separado", filtros por fechas/comunidad/proveedor, y resaltado de deuda judicializada.
- Implementar asistente de alta de comunidad con grupos de reparto y asignación de coeficientes.
- Crear módulo de comunicaciones: recordatorios automáticos por umbral de impagos y combinación de correspondencia por propietario.

**@Legal/Operaciones**
- Validar textos tipo de requerimientos/recordatorios y parámetros de umbral (2–3 recibos) conforme a normativa aplicable.

**@Soporte/Implementación**
- Diseñar plantillas de importación inicial (propietarios, coeficientes, contratos, saldos) y plan de onboarding por comunidad.

## Registro de descubrimientos

### 26 de mayo de 2026 — Primeros problemas confirmados

- Principal problema: lentitud del programa actual.
- La lentitud no parece atribuible al internet o al equipo según revisión con el informático.
- El problema parece general entre personas que utilizan dicho software.
- Falta de filtros y listados adecuados.
- Los listados existentes son incompletos o demasiado básicos.
- Queda pendiente una demostración presencial para analizar el flujo real y concretar prioridades.
