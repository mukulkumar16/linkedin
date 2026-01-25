import prisma from "@/helper/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET(
  _: NextRequest,
   context: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await context.params;

  const {userId} = await auth();
  if (!userId) return NextResponse.json([]);

  const meInDb = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!meInDb) return NextResponse.json([]);

 const messages = await prisma.message.findMany({
  where: { conversationId },
  include: {
    sharedPost: {
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    },
  },
  orderBy: { createdAt: "asc" },
});



  return NextResponse.json(
    messages.map(m => ({
      id: m.id,
      text: m.text,
      type: m.type,
      isSender: m.senderId === meInDb.id,
      sharedPost: m.sharedPost,
    }))
  );
}
