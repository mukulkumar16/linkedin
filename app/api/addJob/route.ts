import { auth } from "@clerk/nextjs/server";
import prisma from "@/helper/prisma";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  try {
    /* ================= AUTH ================= */
    const {userId} = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    /* ================= FIND DB USER ================= */
    const dbUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: "User not found in database" },
        { status: 404 }
      );
    }

    /* ================= READ BODY ================= */
    const body = await req.json();

    const {
      title,
      company,
      location,
      type,
      workplace,
      description,
      salaryMin,
      salaryMax,
      skills,
      isOpen,
    } = body;

    /* ================= VALIDATION ================= */
    if (!title || !company || !location || !description || !type || !workplace) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    /* ================= CREATE JOB ================= */
    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        type,          // JobType enum
        workplace,     // WorkplaceType enum
        description,
        salaryMin,
        salaryMax,
        skills,        // String[]
        isOpen: isOpen ?? true,
        userId: dbUser.id,
      },
    });

    /* ================= RESPONSE ================= */
    return NextResponse.json(
      {
        success: true,
        message: "Job posted successfully",
        data: job,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST JOB ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
