/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `sub_brands` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "sub_brands_slug_key" ON "sub_brands"("slug");
