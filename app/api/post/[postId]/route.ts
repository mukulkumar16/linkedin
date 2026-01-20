import { auth } from "@clerk/nextjs/server";
import prisma from "@/helper/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  _: Request,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { userId } = await auth();
    const { postId } = await context.params;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const post = await prisma.post.findUnique({
    where : {
      id : postId
    }
    });

    if (!post || post.userId !== dbUser.id) {
      return NextResponse.json(
        { error: "Not allowed" },
        { status: 403 }
      );
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
