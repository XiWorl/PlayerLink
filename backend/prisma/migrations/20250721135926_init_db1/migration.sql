-- CreateTable
CREATE TABLE "Tournaments" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Tournaments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tournament" (
    "tournamentId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "rounds" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "allTournamentsId" INTEGER NOT NULL,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("tournamentId")
);

-- CreateTable
CREATE TABLE "_TournamentParticipants" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TournamentParticipants_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_allTournamentsId_key" ON "Tournament"("allTournamentsId");

-- CreateIndex
CREATE INDEX "_TournamentParticipants_B_index" ON "_TournamentParticipants"("B");

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_allTournamentsId_fkey" FOREIGN KEY ("allTournamentsId") REFERENCES "Tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TournamentParticipants" ADD CONSTRAINT "_TournamentParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "Team"("teamId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TournamentParticipants" ADD CONSTRAINT "_TournamentParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "Tournament"("tournamentId") ON DELETE CASCADE ON UPDATE CASCADE;
