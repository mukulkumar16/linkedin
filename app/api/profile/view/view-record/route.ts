import prisma from "@/helper/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { profileUserId } = await req.json();

  // viewer (logged-in user)
  const viewer = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!viewer || viewer.id === profileUserId) {
    return NextResponse.json({ success: false });
  }

  // prevent duplicate views (optional but recommended)
  const alreadyViewed = await prisma.profileView.findFirst({
    where: {
      ownerId: profileUserId,
      viewerId: viewer.id,
    },
  });

  if (!alreadyViewed) {
    await prisma.profileView.create({
      data: {
        ownerId: profileUserId,
        viewerId: viewer.id,
      },
    });
  }

  return NextResponse.json({ success: true });
}
