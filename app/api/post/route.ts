import { NextResponse } from "next/server";
import prisma from "@/helper/prisma";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id : true,
            name: true,
            profile: true
            
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: posts,
      message: "Posts fetched successfully",
    });
  } catch (error) {
    console.error("FETCH POSTS ERROR 👉", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch posts",
      },
      { status: 500 }
    );
  }
}
