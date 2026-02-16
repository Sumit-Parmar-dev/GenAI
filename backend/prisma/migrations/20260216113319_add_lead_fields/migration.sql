-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "company" TEXT,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "jobRole" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "status" SET DEFAULT 'New';
