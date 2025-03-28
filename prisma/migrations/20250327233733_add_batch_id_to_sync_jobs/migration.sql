/*
  Warnings:

  - You are about to drop the `sync_jobs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "sync_jobs" DROP CONSTRAINT "sync_jobs_dashboard_id_fkey";

-- DropTable
DROP TABLE "sync_jobs";

-- CreateTable
CREATE TABLE "SyncJob" (
    "id" TEXT NOT NULL,
    "dashboard_id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "row_index" INTEGER NOT NULL,
    "status" "SyncJobStatus" NOT NULL DEFAULT 'PENDING',
    "result" JSONB,
    "error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "SyncJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SyncJob_dashboard_id_idx" ON "SyncJob"("dashboard_id");

-- CreateIndex
CREATE INDEX "SyncJob_status_idx" ON "SyncJob"("status");

-- CreateIndex
CREATE INDEX "SyncJob_batch_id_idx" ON "SyncJob"("batch_id");

-- CreateIndex
CREATE UNIQUE INDEX "SyncJob_batch_id_row_index_key" ON "SyncJob"("batch_id", "row_index");

-- AddForeignKey
ALTER TABLE "SyncJob" ADD CONSTRAINT "SyncJob_dashboard_id_fkey" FOREIGN KEY ("dashboard_id") REFERENCES "dashboards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
