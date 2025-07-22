/*
  Warnings:

  - Added the required column `isActive` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "isActive" BOOLEAN NOT NULL;
