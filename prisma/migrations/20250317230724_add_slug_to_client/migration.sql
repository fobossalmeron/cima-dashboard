/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `clients` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `clients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "clients_slug_key" ON "clients"("slug");
