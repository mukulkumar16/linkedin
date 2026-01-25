import prisma from "@/helper/prisma";
import {auth}  from "@clerk/nextjs/server";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const end = new Date();
  end.setMonth(end.getMonth() + 1);

  await prisma.user.update({
    where: { clerkId: userId },
    data: {
      isPremium: true,
      premiumEndsAt: end,
    },
  });

  return Response.json({ success: true });
}
