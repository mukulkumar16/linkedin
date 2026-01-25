
import prisma from "@/helper/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user?.isPremium) {
    return new Response("Premium required", { status: 403 });
  }

  const views = await prisma.profileView.findMany({
    where: { ownerId: user.id },
    include: {
      viewer: {
        select: { id: true, name: true, profile: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(views);
}
