-- CreateTable
CREATE TABLE "product_metrics" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "sales" INTEGER NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_metrics_productId_idx" ON "product_metrics"("productId");

-- CreateIndex
CREATE INDEX "product_metrics_formId_idx" ON "product_metrics"("formId");

-- AddForeignKey
ALTER TABLE "product_metrics" ADD CONSTRAINT "product_metrics_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_metrics" ADD CONSTRAINT "product_metrics_formId_fkey" FOREIGN KEY ("formId") REFERENCES "form_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
