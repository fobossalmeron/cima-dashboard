-- CreateTable
CREATE TABLE "giveaway_product_types" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "giveaway_product_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "giveaway_products" (
    "id" TEXT NOT NULL,
    "giveaway_product_type_id" TEXT NOT NULL,
    "submission_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "giveaway_products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "giveaway_product_types_slug_key" ON "giveaway_product_types"("slug");

-- AddForeignKey
ALTER TABLE "giveaway_products" ADD CONSTRAINT "giveaway_products_giveaway_product_type_id_fkey" FOREIGN KEY ("giveaway_product_type_id") REFERENCES "giveaway_product_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "giveaway_products" ADD CONSTRAINT "giveaway_products_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "form_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
