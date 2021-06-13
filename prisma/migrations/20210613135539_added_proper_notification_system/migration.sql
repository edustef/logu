/*
  Warnings:

  - The values [SCHEDULE] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `created_at` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `users_workspaces` table. All the data in the column will be lost.
  - You are about to drop the column `workspaceId` on the `users_workspaces` table. All the data in the column will be lost.
  - You are about to drop the column `scheduleId` on the `users_workspaces_schedules` table. All the data in the column will be lost.
  - You are about to drop the column `userWorkspaceId` on the `users_workspaces_schedules` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,workspace_id]` on the table `users_workspaces` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_workspace_id,schedule_id]` on the table `users_workspaces_schedules` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `users_workspaces` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspace_id` to the `users_workspaces` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schedule_id` to the `users_workspaces_schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_workspace_id` to the `users_workspaces_schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('INVITATION', 'USER_JOINED', 'SCHEDULE_CREATED', 'SCHEDULE_UPCOMING');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "users_workspaces" DROP CONSTRAINT "users_workspaces_userId_fkey";

-- DropForeignKey
ALTER TABLE "users_workspaces" DROP CONSTRAINT "users_workspaces_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "users_workspaces_schedules" DROP CONSTRAINT "users_workspaces_schedules_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "users_workspaces_schedules" DROP CONSTRAINT "users_workspaces_schedules_userWorkspaceId_fkey";

-- DropIndex
DROP INDEX "users_workspaces.userId_workspaceId_unique";

-- DropIndex
DROP INDEX "users_workspaces_schedules.userWorkspaceId_scheduleId_unique";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "created_at",
DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users_workspaces" DROP COLUMN "userId",
DROP COLUMN "workspaceId",
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD COLUMN     "workspace_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users_workspaces_schedules" DROP COLUMN "scheduleId",
DROP COLUMN "userWorkspaceId",
ADD COLUMN     "schedule_id" TEXT NOT NULL,
ADD COLUMN     "user_workspace_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Invitation" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "notification_id" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleNotification" (
    "id" TEXT NOT NULL,
    "notification_id" TEXT NOT NULL,
    "user_workspace_schedule_id" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_workspaces.user_id_workspace_id_unique" ON "users_workspaces"("user_id", "workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_workspaces_schedules.user_workspace_id_schedule_id_unique" ON "users_workspaces_schedules"("user_workspace_id", "schedule_id");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_notification_id_unique" ON "Invitation"("notification_id");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduleNotification_notification_id_unique" ON "ScheduleNotification"("notification_id");

-- AddForeignKey
ALTER TABLE "Notification" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_workspaces" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_workspaces" ADD FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_workspaces_schedules" ADD FOREIGN KEY ("user_workspace_id") REFERENCES "users_workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_workspaces_schedules" ADD FOREIGN KEY ("schedule_id") REFERENCES "schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD FOREIGN KEY ("notification_id") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleNotification" ADD FOREIGN KEY ("notification_id") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleNotification" ADD FOREIGN KEY ("user_workspace_schedule_id") REFERENCES "users_workspaces_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
