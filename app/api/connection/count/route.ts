import { NextResponse } from "next/server";
import prisma from "@/helper/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ count: 0 });
  }

  const count = await prisma.connection.count({
    where: {
      receiverId: user.id,
      status: "PENDING",
    },
  });

  return NextResponse.json({ count });
}
