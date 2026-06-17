import prisma from "@/helper/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const txnid = `txn_${Date.now()}`;
  const amount = "999"; // must be STRING
  const productinfo = "LinkedIn Premium";
  const firstname = user.name || "User";
  const email = user.email || "test@example.com";

  const hashString = [
    process.env.PAYU_MERCHANT_KEY,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    "", "", "", "", "", "", "", "", "", "",
    process.env.PAYU_MERCHANT_SALT,
  ].join("|");

  const hash = crypto
    .createHash("sha512")
    .update(hashString)
    .digest("hex");

  return NextResponse.json({
    key: process.env.PAYU_MERCHANT_KEY,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    phone: "9999999999",
    surl: "https://test.payu.in/merchant/postservice.php?form=success",
    furl: "https://test.payu.in/merchant/postservice.php?form=failure",
    hash,
  });
}
