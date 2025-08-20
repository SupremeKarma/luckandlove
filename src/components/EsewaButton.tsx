typescriptreact
export default function EsewaButton() {
  const handleEsewa = () => {
    const form = document.createElement("form")
    form.method = "POST"
    form.action = "https://esewa.com.np/epay/main"

    const fields = {
      amt: "2000", // price in NPR
      pid: "sample-product-123",
      scd: "EPAYTEST", // merchant code (from eSewa)
      su: "http://localhost:3000/success", // success URL
      fu: "http://localhost:3000/cancel", // failure URL
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
    <button
      onClick={handleEsewa}
      className="w-full py-3 rounded-xl bg-success text-white font-semibold hover:opacity-90 transition"
    >
      Pay with eSewa
    </button>
  )
}