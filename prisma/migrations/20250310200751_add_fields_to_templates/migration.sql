/*
  Warnings:

  - You are about to drop the column `sortOrder` on the `QuestionGroup` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FormTemplate" ADD COLUMN     "dashboardName" TEXT;

-- AlterTable
ALTER TABLE "QuestionGroup" DROP COLUMN "sortOrder";

-- CreateTable
CREATE TABLE "QuestionAttachment" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "QuestionAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuestionAttachment_questionId_idx" ON "QuestionAttachment"("questionId");

-- AddForeignKey
ALTER TABLE "QuestionAttachment" ADD CONSTRAINT "QuestionAttachment_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
