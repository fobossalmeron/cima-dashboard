/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `brands` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `sub_brands` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `sub_brands` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `brands` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `sub_brands` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "brands" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "image_url" TEXT;

-- AlterTable
ALTER TABLE "sub_brands" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "brands_slug_key" ON "brands"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "sub_brands_slug_key" ON "sub_brands"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "sub_brands_name_key" ON "sub_brands"("name");
