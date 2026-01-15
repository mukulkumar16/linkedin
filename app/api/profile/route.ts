export const dynamic = "force-dynamic";
import prisma from "@/helper/prisma";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const email =
      clerkUser.emailAddresses[0]?.emailAddress ?? "";

    // 🔥 CREATE USER IF NOT EXISTS
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`,
          email,
        },
      });
    }

    const body = await req.json();
    const {
      name,
      bio,
      location,
      headline,
      education = [],
      experience = [],
      image,
      cover_img,
    } = body;

    const cleanEducation = education.filter(
      (e: any) => e.institute && e.degree && e.year
    );

    const cleanExperience = experience.filter(
      (e: any) => e.company && e.role && e.duration
    );

    const existing = await prisma.profile.findUnique({
      where: { userId: dbUser.id },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Profile already exists" },
        { status: 400 }
      );
    }

    const profile = await prisma.profile.create({
      data: {
        bio,
        location,
        headline,
        image,
        coverImg: cover_img,
        userId: dbUser.id,
        education: { create: cleanEducation },
        experience: { create: cleanExperience },
      },
    });

    return NextResponse.json({ success: true, profile });
  } catch (err: any) {
    console.error("PROFILE ERROR:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
