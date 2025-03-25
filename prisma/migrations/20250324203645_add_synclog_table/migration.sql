-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('SUCCESS', 'ERROR');

-- CreateTable
CREATE TABLE "sync_logs" (
    "id" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "status" "SyncStatus" NOT NULL,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sync_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sync_logs" ADD CONSTRAINT "sync_logs_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "dashboards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
