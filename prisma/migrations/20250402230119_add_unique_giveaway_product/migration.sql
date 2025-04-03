/*
  Warnings:

  - A unique constraint covering the columns `[giveaway_product_type_id,submission_id]` on the table `giveaway_products` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "giveaway_products_giveaway_product_type_id_idx" ON "giveaway_products"("giveaway_product_type_id");

-- CreateIndex
CREATE INDEX "giveaway_products_submission_id_idx" ON "giveaway_products"("submission_id");

-- CreateIndex
CREATE UNIQUE INDEX "giveaway_products_giveaway_product_type_id_submission_id_key" ON "giveaway_products"("giveaway_product_type_id", "submission_id");
