import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/helper/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();
    const { id } = await params;

    console.log("id from post api:", id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "user not logged in" },
        { status: 401 }
      );
    }

    const posts = await prisma.post.findMany({
      where: { userId : id},
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
