import prisma from "@/helper/prisma";

type NotificationInput = {
  userId: string;        // receiver
  senderId?: string;     // who triggered it
  type:
    | "CONNECTION_REQUEST"
    | "CONNECTION_ACCEPTED"
    | "POST_LIKE"
    | "POST_COMMENT"
    | "MESSAGE";
  entityId?: string;     // postId, messageId etc
  message: string;
};

export async function createNotification({
  userId,
  senderId,
  type,
  entityId,
  message,
}: NotificationInput) {
  return (prisma as any).notification.create({
    data: {
      userId,
      senderId,
      type,
      entityId,
      message,
    },
  });
}
