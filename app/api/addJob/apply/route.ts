import { auth } from "@clerk/nextjs/server";
import prisma from "@/helper/prisma";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const {userId} = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const { jobId } = await req.json();

    if (!jobId) {
      return NextResponse.json(
        { success: false, message: "Job ID required" },
        { status: 400 }
      );
    }

    // ✅ Fetch job
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { userId: true },
    });

    if (!job) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    // 🚫 Prevent job creator from applying
    if (job.userId === dbUser.id) {
      return NextResponse.json(
        {
          success: false,
          message: "You cannot apply to your own job",
        },
        { status: 403 }
      );
    }

    // 🚫 Prevent double apply
    const alreadyApplied = await prisma.jobApplication.findUnique({
      where: {
        jobId_userId: {
          jobId,
          userId: dbUser.id,
        },
      },
    });

    if (alreadyApplied) {
      return NextResponse.json(
        { success: false, message: "Already applied" },
        { status: 409 }
      );
    }

    const application = await prisma.jobApplication.create({
      data: {
        jobId,
        userId: dbUser.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Applied successfully",
      data: application,
    });
  } catch (error) {
    console.error("APPLY JOB ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
