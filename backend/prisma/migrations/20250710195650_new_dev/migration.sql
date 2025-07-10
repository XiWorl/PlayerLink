/*
  Warnings:

  - You are about to drop the column `yearEstablished` on the `Team` table. All the data in the column will be lost.
  - Added the required column `desiredSkillLevel` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Team" DROP COLUMN "yearEstablished",
ADD COLUMN     "desiredPlaysyle" TEXT[],
ADD COLUMN     "desiredSkillLevel" TEXT NOT NULL,
ADD COLUMN     "supportedGames" TEXT[];
