'use server';

/**
 * @fileOverview Provides product recommendations based on user history and cart items.
 *
 * - getProductRecommendations - A function that retrieves product recommendations.
 * - ProductRecommendationsInput - The input type for the getProductRecommendations function.
 * - ProductRecommendationsOutput - The return type for the getProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductRecommendationsInputSchema = z.object({
  browsingHistory: z.array(
    z.string().describe('IDs of products the user has viewed')
  ).optional().describe('The user browsing history.'),
  purchaseHistory: z.array(
    z.string().describe('IDs of products the user has purchased')
  ).optional().describe('The user purchase history.'),
  cartItems: z.array(
    z.string().describe('IDs of products currently in the user cart')
  ).optional().describe('The items currently in the user cart.'),
  numberOfRecommendations: z.number().default(5).describe('The number of product recommendations to return.'),
});
export type ProductRecommendationsInput = z.infer<typeof ProductRecommendationsInputSchema>;

const ProductRecommendationsOutputSchema = z.object({
  productRecommendations: z.array(
    z.string().describe('IDs of recommended products')
  ).describe('A list of recommended product ids based on user history and cart items.'),
});
export type ProductRecommendationsOutput = z.infer<typeof ProductRecommendationsOutputSchema>;

export async function getProductRecommendations(input: ProductRecommendationsInput): Promise<ProductRecommendationsOutput> {
  return productRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productRecommendationsPrompt',
  input: {schema: ProductRecommendationsInputSchema},
  output: {schema: ProductRecommendationsOutputSchema},
  prompt: `You are an expert product recommendation engine for an e-commerce website.

  Based on the user's browsing history, purchase history, and items in their cart, you will recommend products that the user may be interested in.

  Browsing History: {{#if browsingHistory}}{{{browsingHistory}}}{{else}}None{{/if}}
  Purchase History: {{#if purchaseHistory}}{{{purchaseHistory}}}{{else}}None{{/if}}
  Cart Items: {{#if cartItems}}{{{cartItems}}}{{else}}None{{/if}}

  Please provide {{numberOfRecommendations}} product recommendations.

  Ensure that the recommendations are relevant to the user's interests, and that they are all valid product IDs.
  Do not include any product ids that are already in the cart.
  The recommendations should be returned as a JSON array of product IDs.`,
});

const productRecommendationsFlow = ai.defineFlow(
  {
    name: 'productRecommendationsFlow',
    inputSchema: ProductRecommendationsInputSchema,
    outputSchema: ProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
