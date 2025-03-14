/*
  Warnings:

  - A unique constraint covering the columns `[slug,brandId]` on the table `sub_brands` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "sub_brands_name_brandId_key";

-- CreateIndex
CREATE UNIQUE INDEX "sub_brands_slug_brandId_key" ON "sub_brands"("slug", "brandId");
