/*
  Warnings:

  - A unique constraint covering the columns `[userId,workspaceId]` on the table `users_workspaces` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userWorkspaceId,scheduleId]` on the table `users_workspaces_schedules` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_workspaces.userId_workspaceId_unique" ON "users_workspaces"("userId", "workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "users_workspaces_schedules.userWorkspaceId_scheduleId_unique" ON "users_workspaces_schedules"("userWorkspaceId", "scheduleId");
