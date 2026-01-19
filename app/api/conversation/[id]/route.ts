import prisma from "@/helper/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
 _request: NextRequest,
  { params }: RouteContext
): Promise<Response> {
  const {userId} = await auth();
  const { id } = await params;

  if (!userId) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: id },
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
  const isMember = conversation.members.some((m) => m.clerkId === userId);

  if (!isMember) {
    return NextResponse.json("Unauthorized", { status: 403 });
  }

  return NextResponse.json(conversation);
}
