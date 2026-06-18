# Harness de OpenCode

Este archivo define el comportamiento predeterminado de OpenCode dentro de este proyecto. El objetivo es convertir la IA en un arnes de trabajo disciplinado: pequeno, verificable y alineado con el descubrimiento real de Fincas Pro.

## Regla Base

Antes de editar archivos, el agente debe proponer un plan breve y esperar aprobacion. La unica excepcion es leer archivos o buscar contexto para entender la tarea.

## Fuentes de Verdad

| Area | Fuente |
| --- | --- |
| Reglas del repositorio | `AGENTS.md` |
| Contexto de producto (visión) | `docs/00-vision/problema.md` |
| Discovery validado | `docs/01-discovery/observaciones/discovery.md` |
| MVP provisional | `docs/02-requisitos/mvp/mvp.md` |
| Reglas de IA | `docs/04-arquitectura/decisiones/reglas-ia.md` |
| Flujo de trabajo | `docs/02-requisitos/flujo-trabajo.md` |
| Diseno visual | `DESIGN.md`, `docs/03-diseno/README.md` |
| Agentes disponibles como perfiles | `docs/04-arquitectura/decisiones/agentes.md` |
| Skill registry | `.atl/skill-registry.md` |

## Flujo Operativo

1. Entender la tarea y revisar las fuentes relevantes.
2. Separar hechos confirmados, hipotesis y preguntas abiertas.
3. Proponer un plan pequeno con archivos, alcance y verificacion.
4. Esperar aprobacion humana antes de editar.
5. Ejecutar solo lo aprobado.
6. Verificar con lint, typecheck, tests o revision documental segun aplique.
7. Resumir archivos modificados, motivo, verificacion y pendientes.

## Modo SDD Ligero

Usar Spec-Driven Development cuando una tarea implique una pantalla, flujo, regla de producto, arquitectura o cambio de comportamiento.

El flujo minimo es:

1. Proposal: que problema resuelve y que queda fuera.
2. Spec: requisitos, supuestos y criterios de aceptacion.
3. Design: archivos previstos, datos mock, limites tecnicos y riesgos.
4. Tasks: pasos pequenos verificables.
5. Apply: implementacion aprobada, preferiblemente con TDD si hay tests ejecutables.
6. Verify: evidencia de revision o comandos ejecutados.
7. Archive: actualizar docs si se confirma una decision o aprendizaje.

No hace falta crear artefactos pesados para tareas pequenas. Si una tarea cabe en un plan corto y no cambia comportamiento de producto, mantenerlo simple.

## Comandos del Arnes

Estos comandos son convenciones de trabajo para OpenCode. Si existen como comandos configurados en `opencode.json`, usarlos como entrada rapida.

| Comando | Resultado esperado |
| --- | --- |
| `/brief-project` | Resumen de confirmado, hipotesis, fuera de alcance y bloqueos. |
| `/prepare-demo` | Guion para observar a la usuaria real y capturar tiempos, campos, listados y fricciones. |
| `/extract-open-questions` | Lista de preguntas abiertas para discovery sin inventar requisitos. |
| `/review-scope` | Revision de sobreingenieria, alcance y riesgos antes de implementar. |

## Limites Duros

- No usar datos reales de propietarios, CIF, IBAN, emails o informacion sensible.
- No implementar backend real, auth, Prisma, migraciones, Supabase o modelos persistentes sin aprobacion explicita.
- No implementar Norma 43, Norma 19, emails reales, cartas reales ni flujos legales reales en esta fase.
- No instalar dependencias sin aprobacion explicita.
- No convertir hipotesis de discovery en requisitos definitivos.
- No crear pantallas o funcionalidades no pedidas.

## Criterios de Calidad

- La velocidad y la claridad operativa son parte del producto, no decoracion.
- Las tablas, filtros y listados deben tratarse como nucleo funcional.
- Los datos mock deben estar separados de la UI cuando corresponda.
- Si un cambio mezcla producto, UI, datos y arquitectura sin motivo claro, parar y pedir una decision.
- Si el usuario no entiende el cambio, el cambio no esta listo.

## Uso de Subagentes

El agente principal actua como orquestador. Puede delegar exploracion, revision o ejecucion acotada cuando el trabajo sea independiente, pero debe mantener el control del alcance y revisar el resultado antes de darlo por valido.

Los perfiles de `docs/04-arquitectura/decisiones/agentes.md` son guias de rol, no permisos para saltarse las reglas del proyecto.
