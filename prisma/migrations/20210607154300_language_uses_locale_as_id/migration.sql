/*
  Warnings:

  - You are about to drop the column `locale` on the `languages` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "languages.locale_unique";

-- AlterTable
ALTER TABLE "languages" DROP COLUMN "locale";
