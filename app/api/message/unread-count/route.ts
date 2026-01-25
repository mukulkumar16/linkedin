import prisma from "@/helper/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ count: 0 });

  const me = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!me) return NextResponse.json({ count: 0 });

  const conversations = await prisma.conversation.findMany({
    where: {
      members: {
        some: { id: me.id },
      },
    },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      conversationReads: {
        where: { userId: me.id },
      },
    },
  });

  let totalUnread = 0;

  conversations.forEach((c) => {
    const lastMessage = c.messages[0];
    const lastRead = c.conversationReads[0]?.lastReadAt;

    if (
      lastMessage &&
      lastMessage.senderId !== me.id &&
      (!lastRead || lastMessage.createdAt > lastRead)
    ) {
      totalUnread++;
    }
  });

  return NextResponse.json({ count: totalUnread });
}
