import { NextResponse } from "next/server";
import prisma from "@/helper/prisma";
import { auth } from "@clerk/nextjs/server";
import { createNotification } from "@/helper/createNotification";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function POST(req: Request) {
  try {
    const {userId} = await auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { postId } = await req.json();

    // 1️⃣ Find DB user using clerkId
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Check existing like (toggle)
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: dbUser.id,
          postId,
        },
      },
    });

    // 🔁 UNLIKE → no notification
    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });

      return NextResponse.json({ liked: false });
    }

    // 3️⃣ LIKE
    await prisma.like.create({
      data: {
        userId: dbUser.id,
        postId,
      },
    });

    // 4️⃣ Find post owner
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        userId: true,
      },
    });

    // 5️⃣ Create notification (DON'T notify yourself)
    if (post && post.userId !== dbUser.id) {
        await createNotification({
        userId: post.userId,   // post owner
        senderId: dbUser.id,     // liker
        type: "POST_LIKE",
        entityId: post.id,
        message: "liked your post",
      });

      

    }

    return NextResponse.json({ liked: true });

  } catch (error: any) {
    console.error("LIKE ERROR 👉", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
