/*
  Warnings:

  - Added the required column `form_link` to the `form_submissions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "form_submissions" ADD COLUMN     "form_link" TEXT NOT NULL;
