import Stripe from "stripe";
import prisma from "@/helper/prisma";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: Request) {
  const body = await req.json();
  console.log("VERIFY BODY:", body);

  const { sessionId } = body;

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  console.log("STRIPE SESSION:", session);

  if (session.payment_status !== "paid") {
    return new NextResponse("Payment not completed", { status: 400 });
  }

  const clerkId = session.metadata?.clerkId;
  console.log("CLERK ID:", clerkId);

  if (!clerkId) {
    return new NextResponse("Missing clerkId", { status: 400 });
  }

  const end = new Date();
  end.setMonth(end.getMonth() + 1);

  const updatedUser = await prisma.user.update({
    where: { clerkId },
    data: {
      isPremium: true,
      premiumEndsAt: end,
    },
  });

  console.log("USER UPDATED:", updatedUser);

  return NextResponse.json({ success: true });
}
