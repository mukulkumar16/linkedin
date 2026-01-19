import prisma from "@/helper/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        isOpen: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error("GET JOBS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
