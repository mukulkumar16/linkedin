
import prisma from "@/helper/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface Params {
  id: string;
}

export async function GET(
  req: NextRequest,
  context: { params: Params }
) {
  const me = await currentUser();

  if (!me) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: context.params.id },
    include: {
      members: {
        include: {
          profile: true,
        },
      },
      messages: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          text: true,
          senderId: true,
          createdAt: true,
        },
      },
    },
  });

  if (!conversation) {
    return NextResponse.json("Not found", { status: 404 });
  }

  // 🔐 Authorization check
  const isMember = conversation.members.some((m) => m.clerkId === me.id);

  if (!isMember) {
    return NextResponse.json("Unauthorized", { status: 403 });
  }

  return NextResponse.json(conversation);
}
