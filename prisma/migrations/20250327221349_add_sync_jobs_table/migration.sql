-- CreateEnum
CREATE TYPE "SyncJobStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "sync_jobs" (
    "id" TEXT NOT NULL,
    "dashboard_id" TEXT NOT NULL,
    "status" "SyncJobStatus" NOT NULL DEFAULT 'PENDING',
    "total_rows" INTEGER NOT NULL,
    "processed_rows" INTEGER NOT NULL DEFAULT 0,
    "valid_submissions" INTEGER NOT NULL DEFAULT 0,
    "invalid_submissions" INTEGER NOT NULL DEFAULT 0,
    "skipped_submissions" INTEGER NOT NULL DEFAULT 0,
    "updated_submissions" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "sync_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sync_jobs_dashboard_id_idx" ON "sync_jobs"("dashboard_id");

-- CreateIndex
CREATE INDEX "sync_jobs_status_idx" ON "sync_jobs"("status");

-- AddForeignKey
ALTER TABLE "sync_jobs" ADD CONSTRAINT "sync_jobs_dashboard_id_fkey" FOREIGN KEY ("dashboard_id") REFERENCES "dashboards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
