
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/helper/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Find or sync user in your DB
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id }, // <-- link via clerkId
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
