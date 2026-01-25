
import prisma from "@/helper/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return Response.json({});

  const viewer = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!viewer || viewer.id === params.id) return Response.json({});

  await prisma.profileView.upsert({
    where: {
      viewerId_ownerId: {
        viewerId: viewer.id,
        ownerId: params.id,
      },
    },
    update: { createdAt: new Date() },
    create: {
      viewerId: viewer.id,
      ownerId: params.id,
    },
  });

  return Response.json({ success: true });
}
