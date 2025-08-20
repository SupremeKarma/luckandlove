typescriptreact
import { loadStripe } from "@stripe/stripe-js"
import { useState } from "react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!)

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    const res = await fetch("/api/payments/stripe", { method: "POST" })
    const { id } = await res.json()
    const stripe = await stripePromise
    await stripe?.redirectToCheckout({ sessionId: id })
    setLoading(false)
  }

  return (
    <button
      onClick={handleCheckout}
      className="w-full py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover transition"
    >
      {loading ? "Processing..." : "Pay with Card (Stripe)"}
    </button>
  )
}