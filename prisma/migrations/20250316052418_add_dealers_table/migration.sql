/*
  Warnings:

  - You are about to drop the column `optionId` on the `answers` table. All the data in the column will be lost.
  - You are about to drop the column `questionId` on the `answers` table. All the data in the column will be lost.
  - You are about to drop the column `questionKey` on the `answers` table. All the data in the column will be lost.
  - You are about to drop the column `submissionId` on the `answers` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `form_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `form_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `submittedAt` on the `form_submissions` table. All the data in the column will be lost.
  - Added the required column `question_id` to the `answers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question_key` to the `answers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submission_id` to the `answers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_date` to the `form_submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `form_submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submitted_at` to the `form_submissions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_optionId_fkey";

-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_questionId_fkey";

-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_submissionId_fkey";

-- DropIndex
DROP INDEX "answers_optionId_idx";

-- DropIndex
DROP INDEX "answers_questionId_idx";

-- DropIndex
DROP INDEX "answers_questionKey_idx";

-- DropIndex
DROP INDEX "answers_submissionId_idx";

-- AlterTable
ALTER TABLE "answers" DROP COLUMN "optionId",
DROP COLUMN "questionId",
DROP COLUMN "questionKey",
DROP COLUMN "submissionId",
ADD COLUMN     "option_id" TEXT,
ADD COLUMN     "question_id" TEXT NOT NULL,
ADD COLUMN     "question_key" TEXT NOT NULL,
ADD COLUMN     "submission_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "form_submissions" DROP COLUMN "endDate",
DROP COLUMN "startDate",
DROP COLUMN "submittedAt",
ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "legal_name" TEXT,
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "submitted_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "dealers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_other" TEXT,
    "seller_name" TEXT,
    "seller_mobile" TEXT,
    "seller_email" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "form_submission_id" TEXT,

    CONSTRAINT "dealers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dealers_form_submission_id_key" ON "dealers"("form_submission_id");

-- CreateIndex
CREATE INDEX "answers_submission_id_idx" ON "answers"("submission_id");

-- CreateIndex
CREATE INDEX "answers_question_id_idx" ON "answers"("question_id");

-- CreateIndex
CREATE INDEX "answers_option_id_idx" ON "answers"("option_id");

-- CreateIndex
CREATE INDEX "answers_question_key_idx" ON "answers"("question_key");

-- CreateIndex
CREATE INDEX "form_submissions_locationId_idx" ON "form_submissions"("locationId");

-- CreateIndex
CREATE INDEX "form_submissions_representativeId_idx" ON "form_submissions"("representativeId");

-- AddForeignKey
ALTER TABLE "dealers" ADD CONSTRAINT "dealers_form_submission_id_fkey" FOREIGN KEY ("form_submission_id") REFERENCES "form_submissions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "form_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "question_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;
