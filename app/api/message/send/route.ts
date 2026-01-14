
import { NextResponse } from "next/server";
import prisma from "@/helper/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { conversationId, text } = await req.json();
    const me = await currentUser();

    if (!me) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const meInDb = await prisma.user.findUnique({
      where: { clerkId: me.id },
    });

    if (!meInDb) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        text,
        senderId: meInDb.id,
        conversationId,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
