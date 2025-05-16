// Summarize spending habits flow.
'use server';
/**
 * @fileOverview Resume los hábitos de gasto del usuario en cada categoría durante el último mes.
 *
 * - summarizeSpendingHabits - Una función que maneja el resumen de los hábitos de gasto.
 * - SummarizeSpendingHabitsInput - El tipo de entrada para la función summarizeSpendingHabits.
 * - SummarizeSpendingHabitsOutput - El tipo de retorno para la función summarizeSpendingHabits.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSpendingHabitsInputSchema = z.object({
  spendingData: z.record(z.string(), z.number()).describe(
    'Un registro de datos de gastos, donde la clave es la categoría de gasto y el valor es la cantidad gastada en el último mes.'
  ),
});
export type SummarizeSpendingHabitsInput = z.infer<typeof SummarizeSpendingHabitsInputSchema>;

const SummarizeSpendingHabitsOutputSchema = z.object({
  summary: z.string().describe('Un resumen de los hábitos de gasto del usuario en cada categoría.'),
});
export type SummarizeSpendingHabitsOutput = z.infer<typeof SummarizeSpendingHabitsOutputSchema>;

export async function summarizeSpendingHabits(input: SummarizeSpendingHabitsInput): Promise<SummarizeSpendingHabitsOutput> {
  return summarizeSpendingHabitsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSpendingHabitsPrompt',
  input: {schema: SummarizeSpendingHabitsInputSchema},
  output: {schema: SummarizeSpendingHabitsOutputSchema},
  prompt: `Eres un experto en finanzas personales. Estás ayudando a un usuario a comprender sus hábitos de gasto durante el último mes.

  Aquí tienes un registro de sus gastos, donde la clave es la categoría y el valor es la cantidad gastada:

  {{#each spendingData}}
  - {{@key}}: {{this}}
  {{/each}}

  Genera un resumen conciso de los hábitos de gasto del usuario, destacando las categorías en las que gastó más y cualquier área potencial de mejora.
  `,
});

const summarizeSpendingHabitsFlow = ai.defineFlow(
  {
    name: 'summarizeSpendingHabitsFlow',
    inputSchema: SummarizeSpendingHabitsInputSchema,
    outputSchema: SummarizeSpendingHabitsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
