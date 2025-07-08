/*
  Warnings:

  - You are about to drop the column `playerId` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `Application` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[playerAccountId,teamAccountId]` on the table `Application` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `playerAccountId` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamAccountId` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_playerId_fkey";

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_teamId_fkey";

-- DropIndex
DROP INDEX "Application_playerId_teamId_key";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "playerId",
DROP COLUMN "teamId",
ADD COLUMN     "playerAccountId" INTEGER NOT NULL,
ADD COLUMN     "teamAccountId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Application_playerAccountId_teamAccountId_key" ON "Application"("playerAccountId", "teamAccountId");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_playerAccountId_fkey" FOREIGN KEY ("playerAccountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_teamAccountId_fkey" FOREIGN KEY ("teamAccountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
