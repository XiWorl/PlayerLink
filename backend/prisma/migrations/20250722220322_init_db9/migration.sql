/*
  Warnings:

  - Added the required column `participantsAdvancedToNextRound` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "currentRound" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "participantsAdvancedToNextRound" JSONB NOT NULL;
