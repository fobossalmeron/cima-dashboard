/*
  Warnings:

  - You are about to drop the `etnicity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "sampling" DROP CONSTRAINT "sampling_ethnicity_id_fkey";

-- DropTable
DROP TABLE "etnicity";

-- CreateTable
CREATE TABLE "ethnicity" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "ethnicity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ethnicity_slug_key" ON "ethnicity"("slug");

-- AddForeignKey
ALTER TABLE "sampling" ADD CONSTRAINT "sampling_ethnicity_id_fkey" FOREIGN KEY ("ethnicity_id") REFERENCES "ethnicity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
