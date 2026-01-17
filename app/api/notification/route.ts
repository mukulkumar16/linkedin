import prisma from "@/helper/prisma";
import { auth } from "@clerk/nextjs/server";
export const dynamic = "force-dynamic";

export async function GET() {
  const {userId} = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  const notifications = await prisma.notification.findMany({
    where: { userId: dbUser?.id },
    include: {
      sender: {
        select: {
          name: true,
          profile: { select: { image: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(notifications);
}
