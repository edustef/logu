/*
  Warnings:

  - You are about to drop the `Invitation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScheduleNotification` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `resourceId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_notification_id_fkey";

-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_workspace_id_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleNotification" DROP CONSTRAINT "ScheduleNotification_notification_id_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleNotification" DROP CONSTRAINT "ScheduleNotification_user_workspace_schedule_id_fkey";

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "resourceId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Invitation";

-- DropTable
DROP TABLE "ScheduleNotification";
