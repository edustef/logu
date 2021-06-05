/*
  Warnings:

  - You are about to drop the column `isNewUser` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isAdmin` on the `users_workspaces` table. All the data in the column will be lost.
  - Added the required column `is_admin` to the `users_workspaces` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "isNewUser",
ADD COLUMN     "is_new_user" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "name" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users_workspaces" DROP COLUMN "isAdmin",
ADD COLUMN     "is_admin" BOOLEAN NOT NULL;
