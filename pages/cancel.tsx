typescriptreact
import Link from 'next/link';

export default function Cancel() {
  return (
    <div className="min-h-screen bg-dark-bg text-dark-text flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-dark-card rounded-2xl shadow-lg p-6 text-center space-y-4">
        <h1 className="text-2xl font-bold text-red-500">Payment Canceled</h1>
        <p className="text-dark-text/70">Your payment was canceled. You can try again or choose a different payment method.</p>
        <Link href="/checkout" className="inline-block mt-4 px-6 py-2 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover transition">
          Go to Checkout
        </Link>
      </div>
    </div>
  );
}