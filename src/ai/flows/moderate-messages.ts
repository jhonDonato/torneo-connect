'use server';

/**
 * @fileOverview An AI agent for moderating messages in public forums.
 *
 * - moderateMessage - A function that moderates a given message.
 * - ModerateMessageInput - The input type for the moderateMessage function.
 * - ModerateMessageOutput - The return type for the moderateMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModerateMessageInputSchema = z.object({
  message: z.string().describe('The message to be moderated.'),
});
export type ModerateMessageInput = z.infer<typeof ModerateMessageInputSchema>;

const ModerateMessageOutputSchema = z.object({
  isSafe: z.boolean().describe('Whether the message is safe or not.'),
  reason: z.string().describe('The reason why the message is not safe.'),
});
export type ModerateMessageOutput = z.infer<typeof ModerateMessageOutputSchema>;

export async function moderateMessage(input: ModerateMessageInput): Promise<ModerateMessageOutput> {
  return moderateMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'moderateMessagePrompt',
  input: {schema: ModerateMessageInputSchema},
  output: {schema: ModerateMessageOutputSchema},
  prompt: `You are an AI moderator responsible for ensuring a safe and respectful environment in public forums.

  You will receive a message and must determine if it violates the community guidelines.
  If the message is safe, return isSafe: true and reason: \"\".
  If the message is unsafe, return isSafe: false and provide a detailed reason in the reason field.

  Message: {{{message}}}`,
});

const moderateMessageFlow = ai.defineFlow(
  {
    name: 'moderateMessageFlow',
    inputSchema: ModerateMessageInputSchema,
    outputSchema: ModerateMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
