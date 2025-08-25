
'use client';

import Script from "next/script"
import { Button } from "./ui/button";

declare global {
    interface Window {
        KhaltiCheckout: any;
    }
}

export default function KhaltiButton() {
  const handleKhalti = () => {
    if (typeof window.KhaltiCheckout === "undefined") {
      console.error("Khalti script not loaded");
      alert("Khalti is not available at the moment. Please try another payment method.");
      return;
    }

    const checkout = new window.KhaltiCheckout({
      publicKey: process.env.NEXT_PUBLIC_KHALTI_KEY,
      productIdentity: "sample-product-123",
      productName: "Sample Product",
      productUrl: "http://localhost:3000/checkout",
      eventHandler: {
        onSuccess(payload: any) {
          console.log("Khalti Success", payload)
          window.location.href = '/success';
        },
        onError(error: any) {
          console.error("Khalti Error", error)
           window.location.href = '/cancel';
        },
        onClose() {
          console.log("Khalti Checkout closed")
        },
      },
      paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"],
    })
    checkout.show({ amount: 2000 * 100 }) // in paisa
  }

  return (
    <>
      <Script src="https://khalti.com/static/khalti-checkout.js" strategy="beforeInteractive" />
      <Button
        onClick={handleKhalti}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
      >
        Pay with Khalti
      </Button>
    </>
  )
}
