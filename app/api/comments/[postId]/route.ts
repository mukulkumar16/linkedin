import { NextResponse } from "next/server";
import prisma from "@/helper/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ postId?: string }> }
) {
  try {
    // ✅ MUST await params in Next.js 15/16
    const { postId } = await context.params;

    console.log("post id from api route", postId);

    if (!postId) {
      return NextResponse.json(
        { message: "Post ID is required", comments: [] },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            name: true,
            profile: {
              select: {
                image: true,
                headline: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("GET COMMENTS ERROR 👉", error);
    return NextResponse.json(
      { message: "Failed to fetch comments", comments: [] },
      { status: 500 }
    );
  }
}
