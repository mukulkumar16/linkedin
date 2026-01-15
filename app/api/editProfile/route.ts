export const dynamic = "force-dynamic";
import prisma from "@/helper/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(req: Request) {
  try {
    const {userId} = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🔹 Find DB user using clerkId
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const {
      name,
      bio,
      location,
      headline,
      image,
      cover_img,
      education,
      experience,
    } = body;

    /* ---------- USER ---------- */
    if (typeof name === "string") {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { name },
      });
    }

    /* ---------- PROFILE ---------- */
    const profileData: any = {};

    if (typeof bio === "string") profileData.bio = bio;
    if (typeof location === "string") profileData.location = location;
    if (typeof headline === "string") profileData.headline = headline;
    if (typeof image === "string") profileData.image = image;
    if (typeof cover_img === "string") profileData.coverImg = cover_img;

    /* ---------- EDUCATION ---------- */
    if (Array.isArray(education)) {
      profileData.education = {
        deleteMany: {},
        create: education
          .filter(e => e.institute || e.degree || e.year)
          .map(e => ({
            institute: e.institute || "",
            degree: e.degree || "",
            year: e.year || "",
          })),
      };
    }

    /* ---------- EXPERIENCE ---------- */
    if (Array.isArray(experience)) {
      profileData.experience = {
        deleteMany: {},
        create: experience
          .filter(e => e.company || e.role || e.duration)
          .map(e => ({
            company: e.company || "",
            role: e.role || "",
            duration: e.duration || "",
          })),
      };
    }

    const profile = await prisma.profile.update({
      where: { userId: dbUser.id },
      data: profileData,
    });

    return NextResponse.json({ success: true, profile });
  } catch (err: any) {
    console.error("EDIT PROFILE ERROR 👉", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
