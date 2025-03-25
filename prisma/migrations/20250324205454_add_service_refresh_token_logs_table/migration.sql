-- CreateTable
CREATE TABLE "service_refresh_token_logs" (
    "id" TEXT NOT NULL,
    "serviceTokenId" TEXT NOT NULL,
    "status" "SyncStatus" NOT NULL,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_refresh_token_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "service_refresh_token_logs" ADD CONSTRAINT "service_refresh_token_logs_serviceTokenId_fkey" FOREIGN KEY ("serviceTokenId") REFERENCES "service_tokens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
