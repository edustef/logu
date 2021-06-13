/*
  Warnings:

  - You are about to drop the column `isIndividual` on the `workspaces` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "workspaces" DROP COLUMN "isIndividual",
ADD COLUMN     "is_individual" BOOLEAN NOT NULL DEFAULT false;
