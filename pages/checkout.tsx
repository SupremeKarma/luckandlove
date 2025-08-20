import CheckoutButton from "@/components/CheckoutButton"
import EsewaButton from "@/components/EsewaButton"
import KhaltiButton from "@/components/KhaltiButton"

export default function Checkout() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold">Choose Payment Method</h1>

        <div className="grid gap-3">
          {/* Stripe (Global) */}
          <CheckoutButton />

          {/* eSewa (Nepal) */}
          <EsewaButton />

          {/* Khalti (Nepal) */}
          <KhaltiButton />
        </div>
      </div>
    </div>
  )
}