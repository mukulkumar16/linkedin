export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/helper/prisma";

export async function GET(): Promise<NextResponse> {
  try {
    const {userId} = await auth();

    if (!userId) {
      return NextResponse.json([], { status: 401 });
    }

    const suggestions = await prisma.user.findMany({
      where: {
        // 1️⃣ Never suggest myself
        id: {
          not: userId,
        },

        AND: [
          // 2️⃣ No connection request SENT by me
          {
            sentConnections: {
              none: {
                receiverId: userId,
              },
            },
          },

          // 3️⃣ No connection request RECEIVED by me
          {
            receivedConnections: {
              none: {
                senderId: userId,
              },
            },
          },

          // 4️⃣ Not already CONNECTED (ACCEPTED)
          {
            sentConnections: {
              none: {
                status: "ACCEPTED",
              },
            },
          },
          {
            receivedConnections: {
              none: {
                status: "ACCEPTED",
              },
            },
          },
        ],
      },

      take: 10,

      include: {
        profile: true,
      },
    });

    return NextResponse.json(suggestions);
  } catch (error: unknown) {
    console.error("Suggestions error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
