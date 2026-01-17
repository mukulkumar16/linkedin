import { NextResponse, NextRequest } from "next/server";
import prisma from "@/helper/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { createNotification } from "@/helper/createNotification";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Get Clerk user
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Get DB user using clerkId
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!dbUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 3️⃣ Read request body
    const { postId, content } = await req.json();

    if (!content || !postId) {
      return NextResponse.json(
        { message: "PostId and content are required" },
        { status: 400 }
      );
    }

    // 4️⃣ Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId: dbUser.id,
      },
      include: {
        user: {
          select: {
            name: true,
            profile: {
              select: { image: true },
            },
          },
        },
      },
    });

    // 5️⃣ Find post owner
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    // 6️⃣ Create notification (DON'T notify yourself)
    if (post && post.userId !== dbUser.id) {
      await createNotification({
        userId: post.userId,      // post owner
        senderId: dbUser.id,      // commenter
        type: "POST_COMMENT",
        entityId: postId,
        message: "commented on your post",
      });
    }

    return NextResponse.json({ success: true, data: comment });

  } catch (error) {
    console.error("ADD COMMENT ERROR 👉", error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}
