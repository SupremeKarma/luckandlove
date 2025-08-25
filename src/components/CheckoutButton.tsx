
'use client';
import { loadStripe } from "@stripe/stripe-js"
import { useState } from "react"
import { Button } from "./ui/button";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!)

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
        const res = await fetch("/api/payments/stripe", { method: "POST" })
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const { id } = await res.json()
        const stripe = await stripePromise
        if (stripe) {
            await stripe.redirectToCheckout({ sessionId: id })
        }
    } catch (error) {
        console.error("Checkout failed:", error);
        alert("Checkout failed. Please try again.");
    } finally {
        setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleCheckout}
      className="w-full"
      disabled={loading}
    >
      {loading ? "Processing..." : "Pay with Card (Stripe)"}
    </Button>
  )
}
