/*
  Warnings:

  - A unique constraint covering the columns `[userId,senderId,type,entityId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Notification_userId_senderId_type_entityId_key" ON "Notification"("userId", "senderId", "type", "entityId");
