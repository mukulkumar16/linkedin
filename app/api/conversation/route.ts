
import prisma from "@/helper/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const { receiverId } = await req.json();
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 🔑 Sender (current user)
  const sender = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!sender) {
    return new NextResponse("Sender not found", { status: 404 });
  }

  // 🔑 Receiver
  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
  });

  if (!receiver) {
    return new NextResponse("Receiver not found", { status: 404 });
  }

  // ❌ Prevent self chat
  if (sender.id === receiver.id) {
    return new NextResponse("Cannot message yourself", { status: 400 });
  }

  // 🔍 CHECK CONNECTION
  const connection = await prisma.connection.findFirst({
    where: {
      status: "ACCEPTED",
      OR: [
        { senderId: sender.id, receiverId: receiver.id },
        { senderId: receiver.id, receiverId: sender.id },
      ],
    },
  });

  // 🚨 MAIN PREMIUM LOGIC
  if (!connection && !sender.isPremium) {
    return new NextResponse(
      "Upgrade to Premium to message users you're not connected with",
      { status: 403 }
    );
  }

  // 🔁 CHECK EXISTING CONVERSATION
  const existingConversation = await prisma.conversation.findFirst({
    where: {
      members: {
        every: {
          id: { in: [sender.id, receiver.id] },
        },
      },
    },
  });

  if (existingConversation) {
    return NextResponse.json(existingConversation);
  }

  // ✅ CREATE CONVERSATION
  const conversation = await prisma.conversation.create({
    data: {
      members: {
        connect: [{ id: sender.id }, { id: receiver.id }],
      },
    },
  });

  return NextResponse.json(conversation);
}
