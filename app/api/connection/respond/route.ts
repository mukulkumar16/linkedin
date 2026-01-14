import prisma from "@/helper/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const me = await currentUser();
  if (!me) return new Response("Unauthorized", { status: 401 });

  const { connectionId, action } = await req.json(); // ACCEPT | REJECT

  const meInDb = await prisma.user.findUnique({
    where: { clerkId: me.id },
  });

  if (!meInDb) return new Response("User not found", { status: 404 });

  const connection = await prisma.connection.findUnique({
    where: { id: connectionId },
  });

  if (!connection || connection.receiverId !== meInDb.id) {
    return new Response("Not allowed", { status: 403 });
  }

  const updated = await prisma.connection.update({
    where: { id: connectionId },
    data: {
      status: action === "ACCEPT" ? "ACCEPTED" : "REJECTED",
    },
  });

  return Response.json(updated);
}
