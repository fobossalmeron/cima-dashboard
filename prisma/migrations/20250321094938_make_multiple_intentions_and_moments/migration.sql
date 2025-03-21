/*
  Warnings:

  - You are about to drop the column `consumption_moment_id` on the `sampling` table. All the data in the column will be lost.
  - You are about to drop the column `purchase_intention_id` on the `sampling` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "sampling" DROP CONSTRAINT "sampling_consumption_moment_id_fkey";

-- DropForeignKey
ALTER TABLE "sampling" DROP CONSTRAINT "sampling_purchase_intention_id_fkey";

-- AlterTable
ALTER TABLE "sampling" DROP COLUMN "consumption_moment_id",
DROP COLUMN "purchase_intention_id";

-- CreateTable
CREATE TABLE "purchase_intention_sampling" (
    "purchaseIntentionId" TEXT NOT NULL,
    "samplingId" TEXT NOT NULL,

    CONSTRAINT "purchase_intention_sampling_pkey" PRIMARY KEY ("purchaseIntentionId","samplingId")
);

-- CreateTable
CREATE TABLE "consumption_moment_sampling" (
    "consumptionMomentId" TEXT NOT NULL,
    "samplingId" TEXT NOT NULL,

    CONSTRAINT "consumption_moment_sampling_pkey" PRIMARY KEY ("consumptionMomentId","samplingId")
);

-- AddForeignKey
ALTER TABLE "purchase_intention_sampling" ADD CONSTRAINT "purchase_intention_sampling_purchaseIntentionId_fkey" FOREIGN KEY ("purchaseIntentionId") REFERENCES "PurchaseIntention"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_intention_sampling" ADD CONSTRAINT "purchase_intention_sampling_samplingId_fkey" FOREIGN KEY ("samplingId") REFERENCES "sampling"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consumption_moment_sampling" ADD CONSTRAINT "consumption_moment_sampling_consumptionMomentId_fkey" FOREIGN KEY ("consumptionMomentId") REFERENCES "consumption_moments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consumption_moment_sampling" ADD CONSTRAINT "consumption_moment_sampling_samplingId_fkey" FOREIGN KEY ("samplingId") REFERENCES "sampling"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
