-- AlterTable
ALTER TABLE "service_tokens" ADD COLUMN     "refresh_token" TEXT,
ADD COLUMN     "service_client_id" TEXT,
ALTER COLUMN "fingerprint" DROP NOT NULL;
