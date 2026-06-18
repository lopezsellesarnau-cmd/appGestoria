# Integración SDD → Linear

## Regla general

Después de completar una fase SDD, el orchestrator DEBE:

1. **Notificar al usuario** que la fase está completa
2. **Preguntar si quiere guardar en Linear** (no asumir)
3. Si dice sí, **delegar al `linear-scribe`** la operación Linear
4. **Devolver un resumen compacto** al usuario

## Flujo por fase

| Fase SDD | Acción en Linear | Qué se guarda |
|----------|------------------|---------------|
| `sdd-propose` | Crear issue "SDD: Proposal — {nombre}" | Alcance, hipótesis, criterios de éxito |
| `sdd-spec` | Crear issue "SDD: Spec — {nombre}" | Requisitos, casos de uso, criterios de aceptación |
| `sdd-design` | Crear issue "SDD: Design — {nombre}" | Archivos, decisiones técnicas, límites |
| `sdd-tasks` | Crear issue + subtareas | Tasks numeradas con estimate y priority |
| `sdd-apply` | Actualizar estado "In Progress" / "Done" | Comentario con archivos modificados |
| `sdd-verify` | Añadir comentario al issue | Resultado de verificación (pass/fail) |
| `sdd-archive` | Cerrar issue | Summary final + link al archivo |

## Formato del prompt al linear-scribe

```
Guarda en Linear:
- Acción: {crear/actualizar/comentar}
- Issue: {ID o "nuevo"}
- Título: {título}
- Descripción: {resumen de la fase}
- Proyecto: Gestoria
- Priority: {High/Medium}
- Estimate: {puntos}
- Labels: [{labels}]
- Subtasks: [{lista si aplica}]
```

## Ejemplo de notificación al usuario

```
✅ Fase "spec" completada.

¿Quieres que guarde la especificación en Linear?
- Crear issue "SDD: Spec — Pantalla Comunidades" en Gestoria
- Priority: High
- Estimate: 30pts
- Labels: bloque-1, spec

Responda "sí" o "no".
```
