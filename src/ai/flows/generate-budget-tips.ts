// 'use server'
'use server';

/**
 * @fileOverview AI-powered budget tips generator.
 *
 * - generateBudgetTips - A function that generates personalized budget tips based on user spending data.
 * - GenerateBudgetTipsInput - The input type for the generateBudgetTips function.
 * - GenerateBudgetTipsOutput - The return type for the generateBudgetTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBudgetTipsInputSchema = z.object({
  spendingData: z.string().describe('A string containing the user historical spending data in JSON format.  Include spending categories and amounts.'),
  budgetGoals: z.string().describe('A string containing the user defined budget goals for each category in JSON format.'),
});
export type GenerateBudgetTipsInput = z.infer<typeof GenerateBudgetTipsInputSchema>;

const GenerateBudgetTipsOutputSchema = z.object({
  tips: z.string().describe('A summary of personalized tips on how to better manage the budget and optimize spending.'),
});
export type GenerateBudgetTipsOutput = z.infer<typeof GenerateBudgetTipsOutputSchema>;

export async function generateBudgetTips(input: GenerateBudgetTipsInput): Promise<GenerateBudgetTipsOutput> {
  return generateBudgetTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBudgetTipsPrompt',
  input: {schema: GenerateBudgetTipsInputSchema},
  output: {schema: GenerateBudgetTipsOutputSchema},
  prompt: `You are an AI budgeting assistant. Analyze the user's spending data and budget goals to provide personalized tips on how to better manage their budget and optimize spending.

  Spending Data: {{{spendingData}}}
  Budget Goals: {{{budgetGoals}}}

  Provide a summary of tips on how the user can better manage their budget and optimize their spending to meet their financial goals. Focus on actionable advice based on the provided data, not general advice.
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
