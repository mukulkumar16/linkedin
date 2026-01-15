export const dynamic = "force-dynamic";
import prisma from "@/helper/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const {userId} = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User not logged in" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name")?.trim();

    if (!name) {
      return NextResponse.json({ success: true, data: [] });
    }

    const searchUser = await prisma.user.findMany({
      where: {
        AND: [
          {
            name: {
              contains: name,
              mode: "insensitive",
              
            },
          },
          {
            clerkId: {
              not: userId,
            },
          },
        ],
      
      },
      include : {
        profile : true
      },
      orderBy: {
        name: "asc",
      },
      take: 10,
    });

    return NextResponse.json({
      success: true,
      data: searchUser,
    });
  } catch (error) {
    console.error("Search API error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
