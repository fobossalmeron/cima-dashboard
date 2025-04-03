/*
  Warnings:

  - Added the required column `name` to the `giveaway_product_types` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "giveaway_product_types" ADD COLUMN     "name" TEXT NOT NULL;
