-- DropForeignKey
ALTER TABLE "service_refresh_token_logs" DROP CONSTRAINT "service_refresh_token_logs_serviceTokenId_fkey";

-- DropForeignKey
ALTER TABLE "sync_logs" DROP CONSTRAINT "sync_logs_dashboardId_fkey";

-- AddForeignKey
ALTER TABLE "sync_logs" ADD CONSTRAINT "sync_logs_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "dashboards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_refresh_token_logs" ADD CONSTRAINT "service_refresh_token_logs_serviceTokenId_fkey" FOREIGN KEY ("serviceTokenId") REFERENCES "service_tokens"("id") ON DELETE CASCADE ON UPDATE CASCADE;
