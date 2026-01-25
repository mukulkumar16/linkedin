// app/api/cron/expire-premium/route.ts

import prisma from "@/helper/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    // 🔐 SECURITY CHECK (CRON SECRET)
    const authHeader = req.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // ⏳ EXPIRE PREMIUM USERS
    const result = await prisma.user.updateMany({
      where: {
        isPremium: true,
        premiumEndsAt: {
          lt: new Date(),
        },
      },
      data: {
        isPremium: false,
        premiumEndsAt: null,
      },
    });

    return NextResponse.json({
      success: true,
      expiredUsers: result.count,
      message: "Expired premium users updated successfully",
    });
  } catch (error) {
    console.error("CRON ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
