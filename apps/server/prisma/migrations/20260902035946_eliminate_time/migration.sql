/*
  Warnings:

  - You are about to drop the `time` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "time" DROP CONSTRAINT "time_counterId_fkey";

-- DropForeignKey
ALTER TABLE "time" DROP CONSTRAINT "time_participantId_fkey";

-- AlterTable
ALTER TABLE "participant" ADD COLUMN     "times" TEXT[];

-- DropTable
DROP TABLE "time";
