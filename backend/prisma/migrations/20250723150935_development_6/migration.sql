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

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_allTournamentsId_fkey" FOREIGN KEY ("allTournamentsId") REFERENCES "Tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
