/*
  Warnings:

  - Added the required column `desiredSkillLevel` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gameUsernames` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "desiredSkillLevel" TEXT NOT NULL,
ADD COLUMN     "gameUsernames" JSONB NOT NULL,
ADD COLUMN     "gamingExperience" TEXT[],
ADD COLUMN     "playstyle" TEXT[];
