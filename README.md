# Personal Finance Dashboard

Este proyecto es una aplicación web de tablero de finanzas personales construida utilizando Next.js, React y TypeScript. Aprovecha Shadcn UI para una interfaz de usuario moderna y receptiva e integra capacidades de inteligencia artificial (IA) utilizando Genkit para proporcionar información y sugerencias basadas en datos financieros.

La aplicación tiene como objetivo ayudar a los usuarios a rastrear sus ingresos y gastos, visualizar sus hábitos de gasto y recibir asesoramiento impulsado por IA para mejorar su salud financiera.

## Características Clave:

- **Resumen del Tablero:** Proporciona un resumen de ingresos, gastos y ahorros.
- **Visualización de Gastos:** Muestra los patrones de gasto a través de gráficos interactivos.
- **Información Impulsada por IA:** Ofrece consejos personalizados y resúmenes de hábitos de gasto generados por Genkit.
- **Diseño Receptivo:** Construido con Shadcn UI para una experiencia consistente en todos los dispositivos.
- **Seguridad de Tipo:** Desarrollado con TypeScript para mejorar la confiabilidad y el mantenimiento del código.

## Estructura y Funcionalidad del Código:

- **Next.js:** Se utiliza para la renderización del lado del servidor, el enrutamiento (gestionado en el directorio `src/app`) y las rutas de API (para interactuar con el backend y Genkit).
- **React:** La biblioteca principal para construir los componentes de la interfaz de usuario (se encuentran en el directorio `src/components`).
- **TypeScript:** Proporciona tipado estático en todo el proyecto, detectando errores tempranamente y mejorando la legibilidad del código.
- **Shadcn UI:** Ofrece una colección de componentes de interfaz de usuario accesibles y personalizables utilizados para construir la interfaz de la aplicación (`src/components/ui`).
- **Genkit:** Integrado para implementar características de IA, como la generación de consejos de presupuesto y la resumen de datos de gastos (`src/ai`).

Para empezar, echa un vistazo a src/app/page.tsx, que es el punto de entrada principal para la página del tablero.

To get started, take a look at src/app/page.tsx.
