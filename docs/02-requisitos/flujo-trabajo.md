# Flujo de trabajo con IA

## Flujo obligatorio

1. Definir tarea.
2. Pedir plan.
3. Aprobar plan.
4. Ejecutar solo lo aprobado.
5. Revisar diff.
6. Probar cuando exista forma de probar.
7. Documentar cambios relevantes.
8. Hacer commit pequeño cuando el cambio esté revisado.

## 1. Definir tarea

Una buena tarea explica el resultado esperado y el límite del cambio.

Ejemplo bueno:

```text
Crea la documentación inicial para agentes IA. No implementes pantallas ni código de aplicación.
```

Ejemplo malo:

```text
Haz la app de la gestoría.
```

## 2. Pedir plan

Antes de editar, pedir:

```text
Antes de tocar archivos, dime qué vas a cambiar y espera mi confirmación.
```

## 3. Aprobar plan

No ejecutar si el plan mezcla temas o se sale del alcance.

Debe quedar claro:

- Archivos a crear o modificar.
- Qué queda fuera.
- Cómo se verificará.

## 4. Ejecutar

La ejecución debe seguir el plan aprobado.

Si aparece un problema no previsto, la IA debe parar y explicarlo antes de ampliar alcance.

## 5. Revisar

Revisar el diff antes de aceptar.

Preguntas útiles:

- ¿Se cambió solo lo aprobado?
- ¿Hay código o dependencias no pedidas?
- ¿El cambio es entendible?
- ¿Se mezclaron responsabilidades?

## 6. Probar

Cuando existan comandos, ejecutar los que apliquen:

- Lint.
- Typecheck.
- Tests.
- Build si el cambio lo justifica.

Si no existen comandos, dejarlo indicado en el resumen.

## 7. Documentar

Documentar decisiones relevantes en `docs/`.

No documentar por aparentar. Documentar para que el siguiente trabajo sea más claro.

## 8. Commit

Hacer commits pequeños.

Cada commit debe tener una intención clara.

Ejemplos buenos:

```text
docs: add initial AI working rules
docs: document provisional MVP scope
```

Ejemplo malo:

```text
update stuff
```

## Tareas buenas

- Crear documentación inicial de IA.
- Convertir una pantalla mock aprobada en componentes limpios.
- Separar datos mock de una tabla existente.
- Revisar si una propuesta está sobreingenierizada.

## Tareas malas

- Hacer toda la aplicación.
- Crear base de datos definitiva sin validar el flujo.
- Implementar Norma 43 real sin fuentes ni validación.
- Instalar librerías nuevas sin explicar por qué.
- Mezclar dashboard, auth, base de datos y exportaciones en una sola tarea.
