/*
  Warnings:

  - You are about to drop the column `rosterAccountId` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "rosterAccountId",
ADD COLUMN     "rosterAccountIds" INTEGER[];
