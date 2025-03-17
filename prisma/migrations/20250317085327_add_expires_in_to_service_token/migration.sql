/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `service_tokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "service_tokens" DROP COLUMN "expiresAt",
ADD COLUMN     "expiresIn" INTEGER;
