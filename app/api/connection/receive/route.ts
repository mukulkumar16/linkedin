import prisma from "@/helper/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";

export async function GET( _request: NextRequest) {
  const {userId} = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const meInDb = await prisma.user.findUnique({
    where: { clerkId: userId },
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
