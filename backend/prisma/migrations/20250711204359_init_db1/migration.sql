/*
  Warnings:

  - You are about to drop the column `yearEstablished` on the `Team` table. All the data in the column will be lost.
  - Added the required column `gameUsernames` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playstyle` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `desiredSkillLevel` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "gameUsernames" JSONB NOT NULL,
ADD COLUMN     "gamingExperience" TEXT[],
ADD COLUMN     "playstyle" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "yearEstablished",
ADD COLUMN     "desiredPlaystyle" TEXT[],
ADD COLUMN     "desiredSkillLevel" TEXT NOT NULL,
ADD COLUMN     "supportedGames" TEXT[];
