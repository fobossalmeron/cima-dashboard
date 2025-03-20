-- AlterTable
ALTER TABLE "form_submissions" ADD COLUMN     "point_of_sale_id" TEXT,
ADD COLUMN     "product_in_promotion" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "product_location_id" TEXT,
ADD COLUMN     "risk_zone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "samples_delivered" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "points_of_sale" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "points_of_sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_locations" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "points_of_sale_slug_key" ON "points_of_sale"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "product_locations_slug_key" ON "product_locations"("slug");

-- AddForeignKey
ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_point_of_sale_id_fkey" FOREIGN KEY ("point_of_sale_id") REFERENCES "points_of_sale"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_product_location_id_fkey" FOREIGN KEY ("product_location_id") REFERENCES "product_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
