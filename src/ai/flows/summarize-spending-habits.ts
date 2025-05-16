// Summarize spending habits flow.
'use server';
/**
 * @fileOverview Summarizes user's spending habits in each category over the past month.
 *
 * - summarizeSpendingHabits - A function that handles the summarization of spending habits.
 * - SummarizeSpendingHabitsInput - The input type for the summarizeSpendingHabits function.
 * - SummarizeSpendingHabitsOutput - The return type for the summarizeSpendingHabits function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSpendingHabitsInputSchema = z.object({
  spendingData: z.record(z.string(), z.number()).describe(
    'A record of spending data, where the key is the spending category and the value is the amount spent in the past month.'
  ),
});
export type SummarizeSpendingHabitsInput = z.infer<typeof SummarizeSpendingHabitsInputSchema>;

const SummarizeSpendingHabitsOutputSchema = z.object({
  summary: z.string().describe('A summary of the user\'s spending habits in each category.'),
});
export type SummarizeSpendingHabitsOutput = z.infer<typeof SummarizeSpendingHabitsOutputSchema>;

export async function summarizeSpendingHabits(input: SummarizeSpendingHabitsInput): Promise<SummarizeSpendingHabitsOutput> {
  return summarizeSpendingHabitsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSpendingHabitsPrompt',
  input: {schema: SummarizeSpendingHabitsInputSchema},
  output: {schema: SummarizeSpendingHabitsOutputSchema},
  prompt: `You are a personal finance expert. You are helping a user understand their spending habits over the past month.

  Here is a record of their spending, where the key is the category and the value is the amount spent:

  {{#each spendingData}}
  - {{@key}}: {{this}}
  {{/each}}

  Generate a concise summary of the user's spending habits, highlighting the categories where they spent the most and any potential areas for improvement.
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
