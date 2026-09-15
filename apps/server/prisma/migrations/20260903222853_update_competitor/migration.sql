/*
  Warnings:

  - You are about to drop the column `alias` on the `competitor` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `competitor` table. All the data in the column will be lost.
  - You are about to drop the column `document` on the `competitor` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyContact` on the `competitor` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyPhone` on the `competitor` table. All the data in the column will be lost.
  - You are about to drop the column `origin` on the `competitor` table. All the data in the column will be lost.
  - You are about to drop the `register` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[dni]` on the table `competitor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `competitor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `competitor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[carnet]` on the table `competitor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `country` to the `competitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dni` to the `competitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sex` to the `competitor` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `competitor` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "register" DROP CONSTRAINT "register_competitionId_fkey";

-- DropForeignKey
ALTER TABLE "register" DROP CONSTRAINT "register_userId_fkey";

-- DropIndex
DROP INDEX "competitor_document_key";

-- AlterTable
ALTER TABLE "competitor" DROP COLUMN "alias",
DROP COLUMN "city",
DROP COLUMN "document",
DROP COLUMN "emergencyContact",
DROP COLUMN "emergencyPhone",
DROP COLUMN "origin",
ADD COLUMN     "alergy" TEXT,
ADD COLUMN     "banReason" TEXT,
ADD COLUMN     "banned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "blood" TEXT,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "dni" TEXT NOT NULL,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "emergency" TEXT,
ADD COLUMN     "sex" TEXT NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;

-- DropTable
DROP TABLE "register";

-- CreateTable
CREATE TABLE "counter" (
    "id" SERIAL NOT NULL,
    "competitionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "counter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "counter_userId_competitionId_idx" ON "counter"("userId", "competitionId");

-- CreateIndex
CREATE UNIQUE INDEX "counter_userId_competitionId_key" ON "counter"("userId", "competitionId");

-- CreateIndex
CREATE UNIQUE INDEX "competitor_dni_key" ON "competitor"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "competitor_phone_key" ON "competitor"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "competitor_email_key" ON "competitor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "competitor_carnet_key" ON "competitor"("carnet");

-- AddForeignKey
ALTER TABLE "counter" ADD CONSTRAINT "counter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "counter" ADD CONSTRAINT "counter_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
