import prisma from "@/helper/prisma";
import { auth } from "@clerk/nextjs/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function POST(req: Request) {
  const {userId} = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { connectionId, action } = await req.json(); // ACCEPT | REJECT

  const meInDb = await prisma.user.findUnique({
    where: { clerkId: userId },
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
