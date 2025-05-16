// 'use server'
'use server';

/**
 * @fileOverview Generador de consejos de presupuesto impulsado por IA.
 *
 * - generateBudgetTips - Una función que genera consejos de presupuesto personalizados basados en los datos de gastos del usuario.
 * - GenerateBudgetTipsInput - El tipo de entrada para la función generateBudgetTips.
 * - GenerateBudgetTipsOutput - El tipo de retorno para la función generateBudgetTips.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBudgetTipsInputSchema = z.object({
  spendingData: z.string().describe('Una cadena que contiene los datos históricos de gastos del usuario en formato JSON. Incluye categorías de gastos y montos.'),
  budgetGoals: z.string().describe('Una cadena que contiene los objetivos de presupuesto definidos por el usuario para cada categoría en formato JSON.'),
});
export type GenerateBudgetTipsInput = z.infer<typeof GenerateBudgetTipsInputSchema>;

const GenerateBudgetTipsOutputSchema = z.object({
  tips: z.string().describe('Un resumen de consejos personalizados sobre cómo administrar mejor el presupuesto y optimizar los gastos.'),
});
export type GenerateBudgetTipsOutput = z.infer<typeof GenerateBudgetTipsOutputSchema>;

export async function generateBudgetTips(input: GenerateBudgetTipsInput): Promise<GenerateBudgetTipsOutput> {
  return generateBudgetTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBudgetTipsPrompt',
  input: {schema: GenerateBudgetTipsInputSchema},
  output: {schema: GenerateBudgetTipsOutputSchema},
  prompt: `Eres un asistente de presupuesto de IA. Analiza los datos de gastos y los objetivos presupuestarios del usuario para proporcionar consejos personalizados sobre cómo administrar mejor su presupuesto y optimizar los gastos.

  Datos de Gastos: {{{spendingData}}}
  Objetivos de Presupuesto: {{{budgetGoals}}}

  Proporciona un resumen de consejos sobre cómo el usuario puede administrar mejor su presupuesto y optimizar sus gastos para alcanzar sus metas financieras. Concéntrate en consejos prácticos basados en los datos proporcionados, no en consejos generales.
`,
});

const generateBudgetTipsFlow = ai.defineFlow(
  {
    name: 'generateBudgetTipsFlow',
    inputSchema: GenerateBudgetTipsInputSchema,
    outputSchema: GenerateBudgetTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
