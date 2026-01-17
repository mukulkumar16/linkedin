import prisma from "@/helper/prisma";


export async function POST(req: Request) {
  const { text, senderId, conversationId } = await req.json();

  const message = await prisma.message.create({
    data: {
      text,
      senderId,
      conversationId,
    },
  });

  return Response.json(message);
}
