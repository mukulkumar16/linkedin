import { auth } from "@clerk/nextjs/server";
import prisma from "@/helper/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET() {
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
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    /* ================= FETCH USER JOBS ================= */
    const jobs = await prisma.job.findMany({
      where: {
        userId: dbUser.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        applications: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error("MY JOBS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
