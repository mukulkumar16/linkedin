import prisma from "@/helper/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
   _: NextRequest,
  context: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await context.params;

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
        conversationId,
      },
    },
    update: {
      lastReadAt: new Date(),
    },
    create: {
      userId: me.id,
      conversationId,
    },
  });

  return NextResponse.json({ success: true });
}
