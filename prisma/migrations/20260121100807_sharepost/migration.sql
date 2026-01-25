-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'POST');

-- DropIndex
DROP INDEX "Notification_userId_senderId_type_entityId_key";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "sharedPostId" TEXT,
ADD COLUMN     "type" "MessageType" NOT NULL DEFAULT 'TEXT',
ALTER COLUMN "text" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sharedPostId_fkey" FOREIGN KEY ("sharedPostId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
