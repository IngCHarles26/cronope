/*
  Warnings:

  - You are about to drop the column `totalPerCategory` on the `competition` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `participant` table. All the data in the column will be lost.
  - You are about to drop the `_CategoryToCompetition` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryInterval` to the `competition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participantInterval` to the `competition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `competition` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `categoryId` on the `participant` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToCompetition" DROP CONSTRAINT "_CategoryToCompetition_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToCompetition" DROP CONSTRAINT "_CategoryToCompetition_B_fkey";

-- DropForeignKey
ALTER TABLE "participant" DROP CONSTRAINT "participant_categoryId_fkey";

-- AlterTable
ALTER TABLE "competition" DROP COLUMN "totalPerCategory",
ADD COLUMN     "categoryInterval" INTEGER NOT NULL,
ADD COLUMN     "participantInterval" INTEGER NOT NULL,
ADD COLUMN     "startTime" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "participant" DROP COLUMN "number",
ADD COLUMN     "dorsal" INTEGER,
ADD COLUMN     "noFinish" TEXT,
ADD COLUMN     "order" INTEGER,
DROP COLUMN "categoryId",
ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_CategoryToCompetition";

-- CreateTable
CREATE TABLE "categories_in_competition" (
    "id" SERIAL NOT NULL,
    "categoryId" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "categories_in_competition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "categories_in_competition_categoryId_competitionId_idx" ON "categories_in_competition"("categoryId", "competitionId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_in_competition_categoryId_competitionId_key" ON "categories_in_competition"("categoryId", "competitionId");

-- AddForeignKey
ALTER TABLE "categories_in_competition" ADD CONSTRAINT "categories_in_competition_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories_in_competition" ADD CONSTRAINT "categories_in_competition_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participant" ADD CONSTRAINT "participant_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories_in_competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
