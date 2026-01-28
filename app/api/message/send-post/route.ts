import { NextResponse } from "next/server";
import prisma from "@/helper/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { conversationId, sharedPostId } = await req.json();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId: user.id,
      sharedPostId: sharedPostId,
    },
    include: {
      sharedPost: {
        include: {
          user: true,
        },
      },
    },
  });

  return NextResponse.json(message);
}
