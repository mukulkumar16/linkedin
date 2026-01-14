-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('CONNECTION_REQUEST', 'CONNECTION_ACCEPTED', 'POST_LIKE', 'POST_COMMENT', 'MESSAGE');

-- AlterEnum
ALTER TYPE "ConnectionStatus" ADD VALUE 'REJECTED';

-- DropForeignKey
ALTER TABLE "Connection" DROP CONSTRAINT "Connection_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Connection" DROP CONSTRAINT "Connection_senderId_fkey";

-- AlterTable
ALTER TABLE "Connection" ALTER COLUMN "status" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "senderId" TEXT,
    "type" "NotificationType" NOT NULL,
    "entityId" TEXT,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
