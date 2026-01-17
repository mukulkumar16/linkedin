// app/api/connection/accept/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/helper/prisma";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User not logged in" },
        { status: 401 }
      );
    }

    const { connectionId } = await req.json();

    const updated = await prisma.connection.update({
      where: { id: connectionId },
      data: { status: "ACCEPTED" },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("ACCEPT CONNECTION ERROR 👉", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
