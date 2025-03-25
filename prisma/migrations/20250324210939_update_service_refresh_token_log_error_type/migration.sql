/*
  Warnings:

  - The `error` column on the `service_refresh_token_logs` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "service_refresh_token_logs" DROP COLUMN "error",
ADD COLUMN     "error" JSONB;
