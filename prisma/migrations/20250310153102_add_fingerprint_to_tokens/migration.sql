/*
  Warnings:

  - Added the required column `fingerprint` to the `ServiceToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ServiceToken" ADD COLUMN     "fingerprint" TEXT NOT NULL;
