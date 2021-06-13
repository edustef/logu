/*
  Warnings:

  - You are about to drop the column `schedule_end` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `schedule_start` on the `schedules` table. All the data in the column will be lost.
  - The primary key for the `users_workspaces` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users_workspaces_schedules` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `users_workspaces_schedules` table. All the data in the column will be lost.
  - You are about to drop the column `workspaceId` on the `users_workspaces_schedules` table. All the data in the column will be lost.
  - Added the required column `end` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `users_workspaces` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `users_workspaces_schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleId` to the `users_workspaces_schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userWorkspaceId` to the `users_workspaces_schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "schedule_end",
DROP COLUMN "schedule_start",
ADD COLUMN     "end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users_workspaces" DROP CONSTRAINT "users_workspaces_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users_workspaces_schedules" DROP CONSTRAINT "users_workspaces_schedules_pkey",
DROP COLUMN "userId",
DROP COLUMN "workspaceId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "scheduleId" TEXT NOT NULL,
ADD COLUMN     "userWorkspaceId" TEXT NOT NULL,
ADD PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "users_workspaces_schedules" ADD FOREIGN KEY ("userWorkspaceId") REFERENCES "users_workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_workspaces_schedules" ADD FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
