
'use client';

import { Button } from "./ui/button";

export default function EsewaButton() {
  const handleEsewa = () => {
    const form = document.createElement("form")
    form.method = "POST"
    form.action = "https://esewa.com.np/epay/main"

    const fields = {
      tAmt: "2000",
      amt: "2000", // price in NPR
      txAmt: "0",
      psc: "0",
      pdc: "0",
      pid: "sample-product-123",
      scd: "EPAYTEST", // merchant code (from eSewa)
      su: `${window.location.origin}/success`, // success URL
      fu: `${window.location.origin}/cancel`, // failure URL
    }

    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement("input")
      input.type = "hidden"
      input.name = key
      input.value = value
      form.appendChild(input)
    })

    document.body.appendChild(form)
    form.submit()
  }

  return (
    <Button
      onClick={handleEsewa}
      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
    >
      Pay with eSewa
    </Button>
  )
}
