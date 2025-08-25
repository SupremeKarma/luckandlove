
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function SuccessPage() {
  return (
    <div className="container mx-auto flex h-[calc(100vh-10rem)] flex-col items-center justify-center text-center">
      <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
      <h1 className="mb-2 text-3xl font-bold">Payment Successful!</h1>
      <p className="mb-6 text-lg text-muted-foreground">
        Thank you for your purchase. Your order is being processed.
      </p>
      <Link href="/" passHref>
        <button className="rounded-xl bg-accent px-6 py-3 text-white transition hover:opacity-90">
          Continue Shopping
        </button>
      </Link>
    </div>
  )
}
