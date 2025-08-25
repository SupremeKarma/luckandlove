import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Ensure the secret key is provided
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20', // It's best practice to use a recent, fixed API version
});

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { items } = req.body as { items: CartItem[] };

      // Basic validation
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty or invalid.' });
      }

      const line_items = items.map((item: CartItem) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), // Price in cents
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: line_items,
        mode: 'payment',
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancel`,
      });

      res.status(200).json({ sessionId: session.id });

    } catch (err: any) {
      console.error('Stripe API error:', err.message);
      res.status(500).json({ error: `Checkout failed: ${err.message}` });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
