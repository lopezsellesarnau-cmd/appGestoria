# Fincas Pro — Lo que tendrá la app

> **Resumen de una página** para validar con la usuaria antes de seguir construyendo.

## ¿Qué es?

Una aplicación web rápida para que puedas llevar el día a día de comunidades, propietarios, recibos y proveedores **sin la lentitud ni las 6 pestañas** del programa actual.

## ¿Qué tiene ahora mismo?

- **4 comunidades** de ejemplo con sus propietarios y unidades.
- **Mayor de propietario** con sus recibos (los que tiene que pagar cada uno).
- **Mayor de proveedor** con sus gastos y filtros por fecha, categoría y estado.
- **Listado de recibos** con filtros por comunidad, propietario, tipo, estado y fechas.
- Datos mock — todavía no hay base de datos real, todo es de prueba.

## ¿Qué tendría cuando esté lista para que la pruebes?

### 1. Comunidades

Listado de comunidades con su municipio y un resumen rápido. Click en una y ves sus propietarios, sus recibos pendientes y su deuda total.

### 2. Propietarios

Listado completo con:

- Nombre y unidad (piso, local, garaje...)
- Comunidad
- **Deuda total** calculada automáticamente
- **Cuántos recibos pendientes** lleva

Click en uno y entras a su **mayor** (el libro de movimientos).

### 3. Mayor de propietario — el más importante

Dos vistas en una:

- **Combinado:** ves los recibos ordinarios y los extraordinarios juntos (lo normal para ver de un vistazo cuánto debe).
- **Separado:** puedes ver solo ordinarios o solo extraordinarios cuando lo necesites.

Totales arriba: total emitido, total pagado, **total pendiente** con la deuda judicializada destacada en rojo.

### 4. Deudores

Una pantalla pensada para encontrar morosos rápido:

- Filtros por comunidad.
- Columna de **deuda judicial** destacada a simple vista.
- Cuántos recibos pendientes lleva y desde cuándo.
- Click en el deudor y entras directo a su mayor.

### 5. Recibos

Listado completo con filtros por:

- Tipo (ordinario / extraordinario)
- Comunidad
- Propietario
- Estado (pagado, pendiente, reclamado, judicial)
- Fechas

### 6. Proveedores

Listado de proveedores con sus gastos. Filtros por comunidad, categoría (limpieza, mantenimiento, seguros...), estado y fechas. Click en un proveedor y ves su **mayor** (todas sus facturas y pagos).

### 7. Exportar a CSV

De deudores y de recibos, para enviar listados al colegio o a la gestoría sin copiar a mano.

## ¿Qué NO tiene y tendría más adelante?

Esto queda fuera de la primera versión pero está en la lista para después:

- Norma 43 / Norma 19 reales
- Filtro del Modelo 347 (facturas > 3.001 €)
- Comparativos de gastos entre ejercicios
- Presupuesto anual y liquidaciones
- Incidencias, siniestros, obras, contratos
- Recordatorios automáticos de recibos impagados
- Envío de emails desde la propia ficha
- Grupos de reparto y coeficientes al dar de alta una comunidad

## Lo que tendrías que poder hacer con la versión de prueba

1. **Buscar un recibo** concreto filtrando por comunidad, propietario o fechas.
2. **Ver el mayor de un propietario** y cambiar entre vista combinada o separada de ordinarios/extraordinarios.
3. **Encontrar deudores rápido** y ver de un vistazo quién tiene deuda judicializada.
4. **Ver el mayor de un proveedor** y filtrar por fechas o categoría.
5. **Exportar listados** a CSV para llevarte a Excel o al correo.
6. **Navegar sin trabas:** sidebar con todo a un click, sin las 6 pestañas del sistema actual.

## Preguntas para validar contigo

- ¿Esta versión cubre lo más urgente para tu día a día?
- ¿Falta algo crítico que no podemos dejar para después?
- ¿Hay algo de esto que realmente no usarías y podríamos quitar?
- ¿El nivel de detalle de los filtros (comunidad, fechas, tipo, estado) es suficiente?

---

**Lo siguiente, cuando me digas que le encaja:**
1. Arreglar la navegación del menú lateral (ahora hay enlaces que no funcionan).
2. Implementar el mayor dual (combinado/separado) — el dolor principal.
3. Construir la pantalla de deudores con la judicial destacada.
4. Conectar el mayor de proveedor para que sea navegable.
5. Exportar a CSV.

Cada paso es pequeño y verificable, así avanzamos sin romper nada.
