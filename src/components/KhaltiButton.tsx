typescriptreact
import Script from "next/script"

export default function KhaltiButton() {
  const handleKhalti = () => {
    // @ts-ignore
    const checkout = new window.KhaltiCheckout({
      publicKey: process.env.NEXT_PUBLIC_KHALTI_KEY,
      productIdentity: "sample-product-123",
      productName: "Sample Product",
      productUrl: "http://localhost:3000/checkout",
      eventHandler: {
        onSuccess(payload: any) {
          console.log("Khalti Success", payload)
        },
        onError(error: any) {
          console.error("Khalti Error", error)
        },
        onClose() {
          console.log("Khalti Checkout closed")
        },
      },
    })
    checkout.show({ amount: 2000 * 100 }) // in paisa
  }

  return (
    <>
      <Script src="https://khalti.com/static/khalti-checkout.js" strategy="beforeInteractive" />
      <button
        onClick={handleKhalti}
        className="w-full py-3 rounded-xl bg-brandKhalti text-white font-semibold hover:opacity-90 transition"
      >
        Pay with Khalti
      </button>
    </>
  )
}