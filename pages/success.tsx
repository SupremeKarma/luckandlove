typescriptreact
import Link from 'next/link';

export default function Success() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-gray-700 mb-6">Your payment has been processed successfully.</p>
        <Link href="/">
          <span className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            Go to Homepage
          </span>
        </Link>
      </div>
    </div>
  );
}
