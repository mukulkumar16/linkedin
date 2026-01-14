import prisma from "@/helper/prisma";

export async function PATCH(req: Request) {
  const { id } = await req.json();

  await (prisma as any).notification.update({
    where: { id },
    data: { isRead: true },
  });

  return Response.json({ success: true });
}
