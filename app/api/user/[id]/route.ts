import { NextRequest, NextResponse } from "next/server";
import prisma from "@/helper/prisma";
import { auth } from "@clerk/nextjs/server";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: NextRequest,
   { params }: RouteContext
 ): Promise<Response>
 {
  const {userId} = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params; // ✅ await params, NOT params.id
  console.log("id from params ",id);

  try {
   

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        profile: {
          include: {
            education: true,
            experience: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: user });
  } catch {
    return NextResponse.json({ message: "user not found" }, { status: 401 });
  }
}
