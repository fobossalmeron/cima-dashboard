/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `brands` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `presentations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,brandId,subBrandId,presentationId,flavorId]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,brandId]` on the table `sub_brands` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_presentationId_fkey";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "flavorId" TEXT,
ALTER COLUMN "presentationId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "flavors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flavors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "flavors_name_key" ON "flavors"("name");

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_key" ON "brands"("name");

-- CreateIndex
CREATE UNIQUE INDEX "presentations_name_key" ON "presentations"("name");

-- CreateIndex
CREATE INDEX "products_brandId_idx" ON "products"("brandId");

-- CreateIndex
CREATE INDEX "products_subBrandId_idx" ON "products"("subBrandId");

-- CreateIndex
CREATE INDEX "products_presentationId_idx" ON "products"("presentationId");

-- CreateIndex
CREATE INDEX "products_flavorId_idx" ON "products"("flavorId");

-- CreateIndex
CREATE UNIQUE INDEX "products_name_brandId_subBrandId_presentationId_flavorId_key" ON "products"("name", "brandId", "subBrandId", "presentationId", "flavorId");

-- CreateIndex
CREATE UNIQUE INDEX "sub_brands_name_brandId_key" ON "sub_brands"("name", "brandId");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_presentationId_fkey" FOREIGN KEY ("presentationId") REFERENCES "presentations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_flavorId_fkey" FOREIGN KEY ("flavorId") REFERENCES "flavors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
