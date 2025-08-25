
import { XCircle } from "lucide-react"
import Link from "next/link"

export default function CancelPage() {
  return (
    <div className="container mx-auto flex h-[calc(100vh-10rem)] flex-col items-center justify-center text-center">
      <XCircle className="mb-4 h-16 w-16 text-destructive" />
      <h1 className="mb-2 text-3xl font-bold">Payment Cancelled</h1>
      <p className="mb-6 text-lg text-muted-foreground">
        Your payment was not completed. You can try again from your cart.
      </p>
      <Link href="/cart" passHref>
        <button className="rounded-xl bg-accent px-6 py-3 text-white transition hover:opacity-90">
          Return to Cart
        </button>
      </Link>
    </div>
  )
}
