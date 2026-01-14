import { NextResponse , NextRequest } from "next/server";
import prismaClient from "@/helper/prisma";
import { currentUser } from "@clerk/nextjs/server";


export async function POST(req: NextRequest) {
   
    const { connectionId } = await req.json();
    const user = await currentUser();
    if(!user ) {
      return NextResponse.json({
        success : false,
        message : "User not logged in"
      })
    }
  const updated = await prismaClient.connection.update({
    where: { id: connectionId },
    data: { status: "ACCEPTED" },
  });
  

  return NextResponse.json(updated);
}
