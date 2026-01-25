import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/helper/prisma";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

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

  const session = await stripe.checkout.sessions.create({
  mode: "payment",
  payment_method_types: ["card"],
  customer_email: user.email!,
  line_items: [
    {
      price_data: {
        currency: "inr",
        product_data: {
          name: "LinkedIn Premium (1 Month)",
        },
        unit_amount: 99900,
      },
      quantity: 1,
    },
  ],
  success_url: `${process.env.NEXT_PUBLIC_APP_URL}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/premium/cancel`,
  metadata: {
    clerkId: user.clerkId, // ✅ MUST be this
  },
});


  return NextResponse.json({ url: session.url });
}
