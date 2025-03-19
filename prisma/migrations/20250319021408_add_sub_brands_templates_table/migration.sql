/*
  Warnings:

  - You are about to drop the `product_metrics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "product_metrics" DROP CONSTRAINT "product_metrics_formId_fkey";

-- DropForeignKey
ALTER TABLE "product_metrics" DROP CONSTRAINT "product_metrics_productId_fkey";

-- DropTable
DROP TABLE "product_metrics";

-- CreateTable
CREATE TABLE "sub_brands_templates" (
    "subBrandId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,

    CONSTRAINT "sub_brands_templates_pkey" PRIMARY KEY ("subBrandId","templateId")
);

-- AddForeignKey
ALTER TABLE "sub_brands_templates" ADD CONSTRAINT "sub_brands_templates_subBrandId_fkey" FOREIGN KEY ("subBrandId") REFERENCES "sub_brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_brands_templates" ADD CONSTRAINT "sub_brands_templates_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "form_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
