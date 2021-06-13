/*
  Warnings:

  - You are about to drop the `users_notifications` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "users_notifications" DROP CONSTRAINT "users_notifications_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "users_notifications" DROP CONSTRAINT "users_notifications_userId_fkey";

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" TEXT;

-- DropTable
DROP TABLE "users_notifications";

-- AddForeignKey
ALTER TABLE "Notification" ADD FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
