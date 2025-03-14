/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `flavors` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `flavors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "flavors" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "flavors_slug_key" ON "flavors"("slug");
