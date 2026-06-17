import prisma from "@/helper/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const end = new Date();
  end.setMonth(end.getMonth() + 1);

  await prisma.user.update({
    where: { clerkId: userId },
    data: {
      isPremium: true,
      premiumEndsAt: end,
    },
  });

  return NextResponse.json({ success: true });
}
