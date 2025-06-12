-- AlterTable
ALTER TABLE "form_submissions" ADD COLUMN     "cooler_size_id" TEXT,
ADD COLUMN     "coolers_in_pdv" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pop_in_pdv" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pop_type_id" TEXT;

-- CreateTable
CREATE TABLE "cooler_sizes" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "cooler_sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pop_types" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "pop_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cooler_sizes_slug_key" ON "cooler_sizes"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "pop_types_slug_key" ON "pop_types"("slug");

-- AddForeignKey
ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_cooler_size_id_fkey" FOREIGN KEY ("cooler_size_id") REFERENCES "cooler_sizes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_pop_type_id_fkey" FOREIGN KEY ("pop_type_id") REFERENCES "pop_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;
