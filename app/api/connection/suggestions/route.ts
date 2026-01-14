import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/helper/prisma";

export async function GET(): Promise<NextResponse> {
  try {
    const me = await currentUser();

    if (!me) {
      return NextResponse.json([], { status: 401 });
    }

    const suggestions = await prisma.user.findMany({
      where: {
        // 1️⃣ Never suggest myself
        id: {
          not: me.id,
        },

        AND: [
          // 2️⃣ No connection request SENT by me
          {
            sentConnections: {
              none: {
                receiverId: me.id,
              },
            },
          },

          // 3️⃣ No connection request RECEIVED by me
          {
            receivedConnections: {
              none: {
                senderId: me.id,
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
