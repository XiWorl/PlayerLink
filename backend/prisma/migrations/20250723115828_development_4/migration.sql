/*
  Warnings:

  - Added the required column `games` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "games" JSONB NOT NULL,
ADD COLUMN     "rosterAccountId" INTEGER;
