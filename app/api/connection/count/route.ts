import { NextResponse } from "next/server";
import prisma from "@/helper/prisma";
import { auth } from "@clerk/nextjs/server";
export const dynamic = "force-dynamic";

export async function GET() {
  const {userId} = await auth();
  if (!userId) {
    return NextResponse.json({ count: 0 });
  }

  const count = await prisma.connection.count({
    where: {
      receiverId: userId,
      status: "PENDING",
    },
  });

  return NextResponse.json({ count });
}
