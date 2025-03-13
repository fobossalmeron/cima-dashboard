/*
  Warnings:

  - A unique constraint covering the columns `[name,brandId]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "products_name_brandId_subBrandId_presentationId_flavorId_key";

-- CreateIndex
CREATE UNIQUE INDEX "products_name_brandId_key" ON "products"("name", "brandId");
