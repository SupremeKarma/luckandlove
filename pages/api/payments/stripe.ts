import { NextApiRequest, NextApiResponse } from "next"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Sample Product" },
            unit_amount: 2000, // $20
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
    })

    res.json({ id: session.id })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
}