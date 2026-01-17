// app/api/addJob/applied/route.ts

import { auth } from "@clerk/nextjs/server";
import prisma from "@/helper/prisma";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ applied: false });
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) {
    return NextResponse.json({ applied: false });
  }

  const jobId = req.nextUrl.searchParams.get("jobId");
  if (!jobId) {
    return NextResponse.json({ applied: false });
  }

  const applied = await prisma.jobApplication.findUnique({
    where: {
      jobId_userId: {
        jobId,
        userId: dbUser.id,
      },
    },
  });

  return NextResponse.json({ applied: !!applied });
}
