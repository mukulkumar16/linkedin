import prisma from "@/helper/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ await params here

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({}, { status: 401 });
  }

  const viewer = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!viewer || viewer.id === id) {
    return NextResponse.json({});
  }

  await prisma.profileView.upsert({
    where: {
      viewerId_ownerId: {
        viewerId: viewer.id,
        ownerId: id,
      },
    },
    update: {
      createdAt: new Date(),
    },
    create: {
      viewerId: viewer.id,
      ownerId: id,
    },
  });

  return NextResponse.json({ success: true });
}
