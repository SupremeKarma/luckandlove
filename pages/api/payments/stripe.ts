import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { cartItems, shippingInfo } = req.body;

      if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({ error: 'Cart is empty or invalid.' });
      }
      
      if (!shippingInfo) {
        return res.status(400).json({ error: 'Shipping information is missing.' });
      }

      const lineItems = cartItems.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.imageUrl],
          },
          unit_amount: Math.round(item.price * 100), // amount in cents
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancel`,
        metadata: {
          shippingInfo: JSON.stringify(shippingInfo),
          cartItems: JSON.stringify(cartItems.map(item => ({ id: item.id, quantity: item.quantity, name: item.name, price: item.price }))),
        }
      });

      res.status(200).json({ sessionId: session.id });
    } catch (err: any) {
      console.error('Stripe API error:', err.message);
      res.status(500).json({ error: `Error creating checkout session: ${err.message}` });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
