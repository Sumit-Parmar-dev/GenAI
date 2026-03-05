/*
  Warnings:

  - You are about to drop the column `score` on the `Lead` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "score",
ADD COLUMN     "aiCategory" TEXT,
ADD COLUMN     "aiEmailDraft" TEXT,
ADD COLUMN     "aiInsight" TEXT,
ADD COLUMN     "aiReason" TEXT,
ADD COLUMN     "aiScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "budget" DOUBLE PRECISION,
ADD COLUMN     "convertedAt" TIMESTAMP(3),
ADD COLUMN     "isConverted" BOOLEAN NOT NULL DEFAULT false;
