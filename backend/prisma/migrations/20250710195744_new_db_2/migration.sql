/*
  Warnings:

  - You are about to drop the column `desiredPlaysyle` on the `Team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Team" DROP COLUMN "desiredPlaysyle",
ADD COLUMN     "desiredPlaystyle" TEXT[];
