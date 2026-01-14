
import { NextResponse } from "next/server";
import prisma from "@/helper/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { postId } = await req.json();

    if (!postId) {
      return NextResponse.json(
        { success: false, message: "postId required" },
        { status: 400 }
      );
    }

    // 🔹 Get Clerk user (optional for public view)
    const clerkUser = await currentUser();

    let dbUserId: string | null = null;

    if (clerkUser) {
      const dbUser = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
      });

      if (dbUser) {
        dbUserId = dbUser.id;
      }
    }

    // 🔹 Fetch likes
    const likes = await prisma.like.findMany({
      where: { postId },
      select: { userId: true },
    });

    const likedByUser = dbUserId
      ? likes.some((like) => like.userId === dbUserId)
      : false;

    return NextResponse.json({
      success: true,
      likesCount: likes.length,
      likedByUser,
    });

  } catch (error: any) {
    console.error("GET LIKES ERROR 👉", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
