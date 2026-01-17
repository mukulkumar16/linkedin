import { auth } from "@clerk/nextjs/server";
import prisma from "@/helper/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
  const {userId} = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Find or sync user in your DB
  const user = await prisma.user.findUnique({
    where: { clerkId: userId }, // <-- link via clerkId
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
}
