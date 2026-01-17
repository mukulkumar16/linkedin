export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/helper/prisma";
import { NextResponse } from "next/server";

export async function GET(
    _request: Request,
      { params }: { params: Promise<{ jobId : string }> }
) {
    try {
        const { jobId } = await params;

        if (!jobId) {
            return NextResponse.json(
                { success: false, message: "Job ID missing" },
                { status: 400 }
            );
        }

        const user = await currentUser();
        if (!user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const dbUser = await prisma.user.findUnique({
            where: { clerkId: user.id },
        });

        if (!dbUser) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // ✅ Ensure job belongs to logged-in user
        const job = await prisma.job.findUnique({
            where: { id: jobId },
        });

        if (!job || job.userId !== dbUser.id) {
            return NextResponse.json(
                { success: false, message: "Access denied" },
                { status: 403 }
            );
        }


        // ✅ Fetch applicants
        const applicants = await prisma.jobApplication.findMany({
            where: { jobId },
            orderBy: { createdAt: "desc" },
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
            data: applicants,
        });
    } catch (error) {
        console.error("VIEW APPLICANTS ERROR:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch applicants" },
            { status: 500 }
        );
    }
}
