
import prisma from "@/helper/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(

  { params }: { params: { userId: string } }
) {
  const me = await currentUser();
  if (!me) return new Response("Unauthorized", { status: 401 });

  const meInDb = await prisma.user.findUnique({
    where: { clerkId: me.id },
  });

  if (!meInDb) return new Response("User not found", { status: 404 });

  const connection = await prisma.connection.findFirst({
    where: {
      OR: [
        { senderId: meInDb.id, receiverId: params.userId },
        { senderId: params.userId, receiverId: meInDb.id },
      ],
    },
  });

  if (!connection) return Response.json(null);

  return Response.json({
    ...connection,
    isMeSender: connection.senderId === meInDb.id,
    isMeReceiver: connection.receiverId === meInDb.id,
  });
}
