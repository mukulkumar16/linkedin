import prisma from "@/helper/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createNotification } from "@/helper/createNotification"; // ✅ import
export const dynamic = "force-dynamic";

export async function POST(req : NextRequest) {
  try {
    const {userId} = await auth();
    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const { receiverId } = await req.json();

    if (!receiverId) {
      return NextResponse.json(
        { message: "receiverId missing" },
        { status: 400 }
      );
    }

    const meInDb = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!meInDb) {
      return NextResponse.json(
        { message: "User not found in DB" },
        { status: 404 }
      );
    }

    // prevent self connection
    if (meInDb.id === receiverId) {
      return NextResponse.json(
        { message: "Cannot connect with yourself" },
        { status: 400 }
      );
    }

    // prevent duplicates
    const existing = await prisma.connection.findFirst({
      where: {
        OR: [
          { senderId: meInDb.id, receiverId },
          { senderId: receiverId, receiverId: meInDb.id },
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Connection already exists" },
        { status: 400 }
      );
    }

    const connection = await prisma.connection.create({
      data: {
        status: "PENDING",
        sender: {
          connect: { id: meInDb.id },
        },
        receiver: {
          connect: { id: receiverId },
        },
      },
    });

    // 🔔 Notification for connection request
    await createNotification({
      userId: receiverId,       // receiver of the request
      senderId: meInDb.id,      // person sending the request
      type: "CONNECTION_REQUEST",
      entityId: connection.id,
      message: "sent you a connection request",
    });

    return NextResponse.json(connection);
  } catch (error) {
    console.error("CONNECTION ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
