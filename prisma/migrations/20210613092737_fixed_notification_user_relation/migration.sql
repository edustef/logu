/*
  Warnings:

  - You are about to drop the column `notificationId` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_notificationId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "notificationId";
