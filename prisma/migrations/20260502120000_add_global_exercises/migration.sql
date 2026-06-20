-- Add a first-class global exercise flag and allow built-in movements to exist
-- without belonging to a user account.
ALTER TABLE "exercises" ADD COLUMN "is_global" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "exercises" ALTER COLUMN "user_id" DROP NOT NULL;

CREATE INDEX "exercises_is_global_idx" ON "exercises"("is_global");
CREATE INDEX "exercises_user_id_idx" ON "exercises"("user_id");
