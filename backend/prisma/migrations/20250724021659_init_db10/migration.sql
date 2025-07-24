/*
  Warnings:

  - Added the required column `recommendationStatistics` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recommendationHistory` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "recommendationStatistics" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "recommendationHistory" JSONB NOT NULL;
