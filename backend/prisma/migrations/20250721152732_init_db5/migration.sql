/*
  Warnings:

  - You are about to drop the `_TournamentParticipants` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `allParticipants` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_TournamentParticipants" DROP CONSTRAINT "_TournamentParticipants_A_fkey";

-- DropForeignKey
ALTER TABLE "_TournamentParticipants" DROP CONSTRAINT "_TournamentParticipants_B_fkey";

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "allParticipants" JSONB NOT NULL;

-- DropTable
DROP TABLE "_TournamentParticipants";
