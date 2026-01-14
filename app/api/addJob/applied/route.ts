import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/helper/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ applied: false });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser) return NextResponse.json({ applied: false });

  const jobId = req.nextUrl.searchParams.get("jobId");
  if (!jobId) return NextResponse.json({ applied: false });

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
