export const dynamic = "force-dynamic";
import prisma from "@/helper/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  const me = await currentUser();

  if (!me) {
    return new Response("Unauthorized", { status: 401 });
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      members: {
        some: { clerkId: me.id },
      },
    },
    include: {
      members: {
        include: {
          profile: true,
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          text: true,
          createdAt: true,
        },
      },
    },
  });

  const formatted = conversations.map((c) => ({
    id: c.id,
    members: c.members.map((m) => ({
      id: m.id,
      name: m.name,
      image: m.profile?.image,
      isMe: m.clerkId === me.id, // 🔥 MOST IMPORTANT LINE
    })),
    lastMessage: c.messages[0] || null,
  }));

  return Response.json(formatted);
}
