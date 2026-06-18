# Prompts reutilizables

## Crear componente

```text
Quiero crear un componente para [objetivo concreto].
Stack: Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui si ya está disponible.
Antes de editar, propón un plan breve y espera mi confirmación.
Mantén los datos mock separados de la UI.
No instales dependencias, no conectes backend y no crees pantallas extra.
Al terminar, explica los archivos modificados y cómo verificar el cambio.
```

## Revisar código

```text
Revisa este cambio como Review Agent.
Busca bugs, riesgos, cambios fuera de alcance, sobreingeniería y falta de pruebas.
No hagas resumen largo antes de los hallazgos.
Si no hay hallazgos, dilo claramente e indica riesgos residuales.
```

## Convertir HTML de Stitch en componentes limpios

```text
Tengo HTML generado por Stitch para una pantalla mock.
Convierte el diseño en componentes limpios y mantenibles.
No copies el HTML tal cual.
Separa estructura, componentes reutilizables y datos mock.
No agregues dependencias.
No conectes backend.
Antes de editar, propón qué archivos vas a crear o modificar y espera mi confirmación.
```

## Pedir plan antes de editar

```text
Antes de tocar archivos, dame un plan corto.
Incluye archivos que vas a crear o modificar, qué queda fuera de alcance y cómo vas a verificarlo.
No ejecutes nada hasta que te confirme.
```

## Crear datos mock

```text
Crea datos mock para [comunidades / propietarios / recibos / proveedores / deudores].
No uses datos reales.
No diseñes una base de datos definitiva.
Separa los datos mock de los componentes de UI.
Marca cualquier campo dudoso como supuesto pendiente de validar.
```

## Revisar sobreingeniería

```text
Revisa esta propuesta y dime si está sobreingenierizada para la fase actual.
Contexto: frontend prototype con datos mock, sin backend real, sin auth y sin base de datos real.
Indica qué simplificarías, qué dejarías para más adelante y qué decisión mínima tomarías ahora.
```
