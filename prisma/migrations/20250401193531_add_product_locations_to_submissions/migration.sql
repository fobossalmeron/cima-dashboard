/*
  Warnings:

  - You are about to drop the column `product_location_id` on the `form_submissions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "form_submissions" DROP CONSTRAINT "form_submissions_product_location_id_fkey";

-- AlterTable
ALTER TABLE "form_submissions" DROP COLUMN "product_location_id";

-- CreateTable
CREATE TABLE "product_location_submissions" (
    "product_location_id" TEXT NOT NULL,
    "submission_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "product_location_submissions_product_location_id_submission_key" ON "product_location_submissions"("product_location_id", "submission_id");

-- AddForeignKey
ALTER TABLE "product_location_submissions" ADD CONSTRAINT "product_location_submissions_product_location_id_fkey" FOREIGN KEY ("product_location_id") REFERENCES "product_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_location_submissions" ADD CONSTRAINT "product_location_submissions_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "form_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
