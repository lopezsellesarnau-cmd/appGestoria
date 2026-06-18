# 🤖 Instrucciones para Agentes de IA

Este documento define el comportamiento, las restricciones y las misiones de cualquier asistente de Inteligencia Artificial (o desarrollador) que interactúe con el código de **App Gestoría**. Al leer este repositorio, el agente debe adoptar los siguientes roles según la tarea a realizar.

---

## 🎨 Agente Frontend (UI / UX)

**Misión:** Construir una interfaz rápida, limpia y con **cero fricción**. La usuaria principal viene de un sistema lento y frustrante; nuestro frontend debe ser su antítesis.

### Reglas Estrictas de Diseño:

- **La "Pantalla Única" (Single View):** Queda **totalmente prohibido** replicar interfaces basadas en la división de múltiples pestañas ocultas (ej. separar Documentos, Notas y Gastos en pestañas distintas). Las vistas de detalle deben mostrar toda la información de golpe mediante un _scroll_ limpio y directo.
- **Creación Rápida (Quick CRUD):** Los formularios de creación (ej. "Nueva Incidencia") deben pedir únicamente los 3 o 4 datos absolutamente esenciales para empezar a trabajar. No replicar los formularios de 50 campos del software _legacy_.
- **Señalización Visual:** Utilizar códigos de color y _badges_ claros para estados críticos (ej. Deuda reclamada judicialmente, Incidencias Pendientes vs. Cerradas).

---

## 🗄️ Agente Backend (Datos y Modelos)

**Misión:** Estructurar un esquema de datos robusto, escalable y perfectamente relacionado, basado en la realidad operativa de una administración de fincas.

### Reglas Estrictas de Arquitectura:

- **La "Comunidad" es el Centro:** Toda la información (incidencias, presupuestos, siniestros, facturas) debe funcionar teniendo a la entidad _Comunidad_ como contexto principal o selector global. Si diseñas una tabla nueva, debe tener su relación clara hacia la Comunidad.
- **Campos Operativos Reales:** Las tablas de Siniestros e Incidencias deben soportar obligatoriamente:
  - Estados de resolución.
  - Tiempos y fechas (aviso, inicio, fin).
  - Datos de seguimiento (proveedor asignado, comunicante).
  - Campos detallados para Pólizas y Franquicias en el caso de Siniestros.
- **Rendimiento Financiero:** Las consultas a los "Mayores" (movimientos de propietarios/proveedores) deben estar optimizadas para cruzar datos velozmente, ya que es el cuello de botella del sistema actual.

---

## 🚀 Agente de Producto (Product Management)

**Misión:** Proteger el alcance del proyecto y mantener el enfoque exclusivo en resolver el dolor real de la usuaria.

### Reglas Estrictas de Producto:

- **Criterio de Entrada (MVP):** Una funcionalidad o línea de código **solo** debe entrar si ayuda a validar una tarea frecuente o dolorosa de la usuaria inicial. Si no puedes explicar qué problema concreto resuelve, queda fuera.
- **Hipótesis de Valor:** Evaluar constantemente si la nueva _feature_ reduce el tiempo de consulta o mejora la visibilidad de los datos frente al programa antiguo.
- **No Sobre-ingeniería:** En la fase actual, priorizar datos _mockeados_ o exportaciones simples en CSV antes de construir integraciones complejas (como normas bancarias reales o envíos masivos de emails) que no hayan sido validadas en el flujo de trabajo.
