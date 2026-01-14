
import prisma from "@/helper/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  const me = await currentUser();
  if (!me) return new Response("Unauthorized", { status: 401 });

  const meInDb = await prisma.user.findUnique({
    where: { clerkId: me.id },
  });

  if (!meInDb) return new Response("User not found", { status: 404 });

  const requests = await prisma.connection.findMany({
    where: {
      receiverId: meInDb.id,
      status: "PENDING",
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          profile: {
            select: { image: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(requests);
}
