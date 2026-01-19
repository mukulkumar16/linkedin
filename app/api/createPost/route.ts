import { NextResponse } from "next/server";
import prisma from "@/helper/prisma";
import { auth } from "@clerk/nextjs/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function POST(req: Request) {
  const {userId} = await auth();
  try {
 

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where : {clerkId : userId}
    })

    if(!dbUser) return NextResponse.json({message : "user not found" },{ status : 401} );

    const { caption, image } = await req.json();

    const newPost = await prisma.post.create({
      data: {
        userId: dbUser.id,
        caption,
        image: image || null,
      },
    });

    return NextResponse.json({ success: true, data: newPost });

  } catch (error: any) {
    console.error("CREATE POST ERROR 👉", error);

    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
