import prisma from "@/helper/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json([], { status: 200 }); // ✅ always JSON
  }

  const me = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!me) {
    return NextResponse.json([], { status: 200 }); // ✅
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      members: {
        some: { id: me.id },
      },
    },
    include: {
      members: {
        select: {
          id: true,
          name: true,
          profile: { select: { image: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(conversations); // ✅ ALWAYS returns JSON
}
