import prisma from "@/helper/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function POST(req: Request) {
  const { receiverId } = await req.json();

  const {userId} = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 🔑 Find sender using clerkId
  const sender = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!sender) {
    return new NextResponse("Sender not found", { status: 404 });
  }

  // 🔑 Find receiver using DB id
  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
  });

  if (!receiver) {
    return new NextResponse("Receiver not found", { status: 404 });
  }

  // ❌ Prevent self chat
  if (sender.id === receiver.id) {
    return new NextResponse("Cannot chat with yourself", { status: 400 });
  }

  // 🔒 STEP 1: CHECK CONNECTION STATUS
  const connection = await prisma.connection.findFirst({
    where: {
      status: "ACCEPTED",
      OR: [
        {
          senderId: sender.id,
          receiverId: receiver.id,
        },
        {
          senderId: receiver.id,
          receiverId: sender.id,
        },
      ],
    },
  });

  if (!connection) {
    return new NextResponse(
      "You can only message connected users",
      { status: 403 }
    );
  }

  // 🔁 STEP 2: CHECK EXISTING CONVERSATION
  const existing = await prisma.conversation.findFirst({
    where: {
      members: {
        every: {
          id: { in: [sender.id, receiver.id] },
        },
      },
    },
  });

  if (existing) {
    return NextResponse.json(existing);
  }

  // ✅ STEP 3: CREATE CONVERSATION
  const conversation = await prisma.conversation.create({
    data: {
      members: {
        connect: [{ id: sender.id }, { id: receiver.id }],
      },
    },
  });

  return NextResponse.json(conversation);
}
