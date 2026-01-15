// app/api/allpost/[id]/route.ts
export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/helper/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "user not logged in" },
        { status: 401 }
      );
    }

    const { id } = context.params;

    const posts = await prisma.post.findMany({
      where: { userId: id },
      include: {
        user: { include: { profile: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
