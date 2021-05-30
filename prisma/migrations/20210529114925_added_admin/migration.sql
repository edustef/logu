/*
  Warnings:

  - Added the required column `isAdmin` to the `users_workspaces` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users_workspaces" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL;
