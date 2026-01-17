import prisma from "@/helper/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
export const dynamic = "force-dynamic";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await params;

  const {userId} = await auth();
  if (!userId) return NextResponse.json([]);

  const meInDb = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!meInDb) return NextResponse.json([]);

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(
    messages.map(m => ({
      text: m.text,
      isSender: m.senderId === meInDb.id,
    }))
  );
}
