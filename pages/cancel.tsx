import Link from 'next/link';

export default function Cancel() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 text-center space-y-4">
        <h1 className="text-2xl font-bold text-red-500">Payment Canceled</h1>
        <p className="text-gray-600">Your payment was canceled. You can try again or choose a different payment method.</p>
        <Link href="/checkout" className="inline-block mt-4 px-6 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
          Go to Checkout
        </Link>
      </div>
    </div>
  );
}