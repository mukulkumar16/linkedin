import prisma from "@/helper/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { conversationId, type, text, sharedPostId } = body;

    if (!conversationId || !type) {
      return NextResponse.json(
        { error: "conversationId and type are required" },
        { status: 400 }
      );
    }

    // Find logged-in user in DB
    const me = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!me) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    /* ---------- VALIDATION ---------- */

    if (type === "TEXT" && !text?.trim()) {
      return NextResponse.json(
        { error: "Text message cannot be empty" },
        { status: 400 }
      );
    }

    if (type === "POST" && !sharedPostId) {
      return NextResponse.json(
        { error: "sharedPostId is required for POST messages" },
        { status: 400 }
      );
    }

    /* ---------- CREATE MESSAGE ---------- */

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: me.id,
        type,
        text: type === "TEXT" ? text : null,
        sharedPostId: type === "POST" ? sharedPostId : null,
      },
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
    });

    return NextResponse.json({
      id: message.id,
      type: message.type,
      text: message.text,
      sharedPost: message.sharedPost,
    });
  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
