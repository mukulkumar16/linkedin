// app/api/addJob/applied/route.ts
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/helper/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Get current user
  const user = await currentUser();
  if (!user) return NextResponse.json({ applied: false });

  // Find user in DB
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });
  if (!dbUser) return NextResponse.json({ applied: false });

  // Get jobId from query
  const jobId = req.nextUrl.searchParams.get("jobId");
  if (!jobId) return NextResponse.json({ applied: false });

  // Check if applied
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
