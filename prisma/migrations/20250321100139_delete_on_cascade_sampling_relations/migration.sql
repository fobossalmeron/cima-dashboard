-- DropForeignKey
ALTER TABLE "consumption_moment_sampling" DROP CONSTRAINT "consumption_moment_sampling_samplingId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_intention_sampling" DROP CONSTRAINT "purchase_intention_sampling_samplingId_fkey";

-- AddForeignKey
ALTER TABLE "purchase_intention_sampling" ADD CONSTRAINT "purchase_intention_sampling_samplingId_fkey" FOREIGN KEY ("samplingId") REFERENCES "sampling"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consumption_moment_sampling" ADD CONSTRAINT "consumption_moment_sampling_samplingId_fkey" FOREIGN KEY ("samplingId") REFERENCES "sampling"("id") ON DELETE CASCADE ON UPDATE CASCADE;
