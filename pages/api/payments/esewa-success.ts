import type { NextApiRequest, NextApiResponse } from "next";
import { verifyEsewaPayment } from "@/utils/esewa";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { oid, amt, refId } = req.query;

  if (!oid || !amt || !refId) {
    return res.redirect("/cancel");
  }

  const isVerified = await verifyEsewaPayment({
    amt: Number(amt),
    pid: oid as string,
    refId: refId as string,
    isSandbox: true, // set to false in production
  });

  if (isVerified) {
    // ✅ Save to DB here (order completed)
    return res.redirect("/success");
  } else {
    return res.redirect("/cancel");
  }
}