// app/api/comments/[postId]/route.ts
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/helper/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    // MUST await params in Next.js 16
    const { postId } = await context.params;

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
