-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('Submitted', 'UnderReview', 'Planned', 'Completed', 'Rejected');

-- AlterTable
ALTER TABLE "feedback" ADD COLUMN "status" "FeedbackStatus" NOT NULL DEFAULT 'Submitted';
