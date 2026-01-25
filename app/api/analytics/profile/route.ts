import prisma from "@/helper/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  const days = user?.isPremium ? 30 : 7;

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);

  const count = await prisma.profileView.count({
    where: {
      ownerId: user!.id,
      createdAt: { gte: fromDate },
    },
  });

  return Response.json({ count, days });
}
