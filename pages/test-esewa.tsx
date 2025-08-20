import { useState } from "react";
import EsewaButton from "@/components/EsewaButton";

export default function TestEsewa() {
  const [amount, setAmount] = useState<number>(100); // Default test amount
  const [pid, setPid] = useState<string>("TEST123456"); // Test product ID

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">eSewa Payment Test</h1>

      <div className="mb-4 w-full max-w-sm">
        <label className="block text-gray-700 mb-2">Amount (NPR)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-6 w-full max-w-sm">
        <label className="block text-gray-700 mb-2">Product ID</label>
        <input
          type="text"
          value={pid}          onChange={(e) => setPid(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <EsewaButton amount={amount} pid={pid} />
      
      <p className="mt-6 text-gray-500 text-sm">
        This page simulates an eSewa payment in sandbox mode. Enter any amount and product ID to test the flow.
      </p>
    </div>
  );
}