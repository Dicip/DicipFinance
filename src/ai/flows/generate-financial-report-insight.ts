
'use server';
/**
 * @fileOverview Genera un análisis financiero y una opinión basada en los datos de ingresos, gastos y presupuestos.
 *
 * - generateFinancialReportInsight - Función que genera la opinión financiera.
 * - GenerateFinancialReportInsightInput - El tipo de entrada para la función.
 * - GenerateFinancialReportInsightOutput - El tipo de retorno para la función.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFinancialReportInsightInputSchema = z.object({
  totalIncome: z.number().describe('Los ingresos totales del período.'),
  totalExpenses: z.number().describe('Los gastos totales del período.'),
  balance: z.number().describe('El saldo final (ingresos - gastos).'),
  spendingByCategory: z
    .record(z.string(), z.number())
    .describe(
      'Un objeto donde cada clave es el nombre de una categoría de gasto y el valor es el monto total gastado en esa categoría.'
    ),
  budgetGoals: z
    .record(z.string(), z.number())
    .describe(
      'Un objeto donde cada clave es el nombre de una categoría de gasto y el valor es el monto objetivo del presupuesto para esa categoría.'
    ),
  currency: z.string().default('CLP').describe('La moneda utilizada para los montos.'),
});
export type GenerateFinancialReportInsightInput = z.infer<
  typeof GenerateFinancialReportInsightInputSchema
>;

const GenerateFinancialReportInsightOutputSchema = z.object({
  reportSummary: z
    .string()
    .describe(
      'Un análisis conciso y profesional de la salud financiera, destacando puntos positivos, áreas de mejora y cumplimiento de presupuestos. Debe estar redactado en un tono formal y orientado a un informe empresarial.'
    ),
});
export type GenerateFinancialReportInsightOutput = z.infer<
  typeof GenerateFinancialReportInsightOutputSchema
>;

export async function generateFinancialReportInsight(
  input: GenerateFinancialReportInsightInput
): Promise<GenerateFinancialReportInsightOutput> {
  return generateFinancialReportInsightFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFinancialReportInsightPrompt',
  input: {schema: GenerateFinancialReportInsightInputSchema},
  output: {schema: GenerateFinancialReportInsightOutputSchema},
  prompt: `
    Eres un asesor financiero experto encargado de redactar un breve análisis para un informe financiero.
    Analiza los siguientes datos financieros para el período:

    Moneda: {{{currency}}}
    Ingresos Totales: {{{totalIncome}}}
    Gastos Totales: {{{totalExpenses}}}
    Saldo Final: {{{balance}}}

    Desglose de Gastos por Categoría:
    {{#each spendingByCategory}}
    - {{{@key}}}: {{{this}}}
    {{else}}
    - No se registraron gastos detallados por categoría.
    {{/each}}

    Objetivos de Presupuesto por Categoría:
    {{#each budgetGoals}}
    - {{{@key}}}: {{{this}}}
    {{else}}
    - No se establecieron objetivos de presupuesto.
    {{/each}}

    Basándote en esta información, proporciona un "reportSummary" que sea un análisis conciso y profesional.
    El análisis debe:
    1.  Comenzar con una evaluación general de la salud financiera.
    2.  Destacar los puntos positivos (ej. saldo positivo, cumplimiento de presupuestos).
    3.  Identificar áreas de mejora o preocupación (ej. gastos elevados en ciertas categorías, incumplimiento de presupuestos).
    4.  Comparar los gastos reales con los objetivos presupuestarios para las categorías relevantes.
    5.  Mantener un tono formal, objetivo y adecuado para un informe empresarial.
    6.  Ser breve y directo al grano. No exceder los 3-4 párrafos.
    7.  Utiliza la moneda proporcionada al referirte a montos.
  `,
});

const generateFinancialReportInsightFlow = ai.defineFlow(
  {
    name: 'generateFinancialReportInsightFlow',
    inputSchema: GenerateFinancialReportInsightInputSchema,
    outputSchema: GenerateFinancialReportInsightOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
