-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('player', 'team');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('pending', 'accepted', 'rejected');

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accountType" "AccountType" NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "playerId" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "yearsOfExperience" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "willingToRelocate" BOOLEAN NOT NULL,
    "playstyle" TEXT NOT NULL,
    "gamingExperience" TEXT[],
    "games" JSONB NOT NULL,
    "gameUsernames" JSONB NOT NULL,
    "bio" TEXT,
    "about" TEXT,
    "accountId" INTEGER NOT NULL,
    "rosterAccountIds" INTEGER[],
    "recommendationStatistics" JSONB NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("playerId")
);

-- CreateTable
CREATE TABLE "Team" (
    "teamId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "rosterAccountIds" INTEGER[],
    "currentlyHiring" BOOLEAN NOT NULL,
    "desiredPlaystyle" TEXT[],
    "supportedGames" TEXT[],
    "desiredSkillLevel" TEXT NOT NULL,
    "description" TEXT,
    "overview" TEXT,
    "recommendationHistory" JSONB NOT NULL,
    "accountId" INTEGER NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("teamId")
);

-- CreateTable
CREATE TABLE "Application" (
    "applicationId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playerAccountId" INTEGER NOT NULL,
    "teamAccountId" INTEGER NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "Application_pkey" PRIMARY KEY ("applicationId")
);

-- CreateTable
CREATE TABLE "Tournaments" (
    "id" SERIAL NOT NULL,
    "tournamentIds" INTEGER[],

    CONSTRAINT "Tournaments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tournament" (
    "tournamentId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "rounds" JSONB NOT NULL,
    "minimumParticipants" INTEGER NOT NULL,
    "currentRound" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorAccountId" INTEGER NOT NULL,
    "allTournamentsId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "allParticipants" JSONB NOT NULL,
    "participantsAdvancedToNextRound" JSONB NOT NULL,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("tournamentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Player_accountId_key" ON "Player"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_accountId_key" ON "Team"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Application_playerAccountId_teamAccountId_key" ON "Application"("playerAccountId", "teamAccountId");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_playerAccountId_fkey" FOREIGN KEY ("playerAccountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_teamAccountId_fkey" FOREIGN KEY ("teamAccountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_allTournamentsId_fkey" FOREIGN KEY ("allTournamentsId") REFERENCES "Tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
