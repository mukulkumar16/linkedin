import prisma from "@/helper/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({}, { status: 401 });

  const me = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!me) return NextResponse.json({}, { status: 404 });

  await prisma.conversationReads.upsert({
    where: {
      userId_conversationId: {
        userId: me.id,
        conversationId: params.conversationId,
      },
    },
    update: {
      lastReadAt: new Date(),
    },
    create: {
      userId: me.id,
      conversationId: params.conversationId,
    },
  });

  return NextResponse.json({ success: true });
}
