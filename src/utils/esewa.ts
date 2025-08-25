
export interface EsewaVerifyParams {
  amt: number;
  pid: string; // your order id
  refId: string; // eSewa transaction reference
  scd?: string; // merchant code, defaults to sandbox
  isSandbox?: boolean; // true = sandbox, false = false
}

export async function verifyEsewaPayment({
  amt,
  pid,
  refId,
  scd = "EPAYTEST",
  isSandbox = true,
}: EsewaVerifyParams): Promise<boolean> {
  try {
    const baseUrl = isSandbox
      ? "https://uat.esewa.com.np/epay/transrec"
      : "https://esewa.com.np/epay/transrec";

    const url = `${baseUrl}?amt=${amt}&scd=${scd}&pid=${pid}&rid=${refId}`;
    const response = await fetch(url);
    const text = await response.text();

    return text.includes("Success");
  } catch (error) {
    console.error("eSewa verification error:", error);
    return false;
  }
}
