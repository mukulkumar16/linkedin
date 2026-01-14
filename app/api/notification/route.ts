
import prisma from "@/helper/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  const me = await currentUser();
  if (!me) return new Response("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: me.id },
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
