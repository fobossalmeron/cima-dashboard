/*
  Warnings:

  - A unique constraint covering the columns `[submission_id]` on the table `sampling` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "sampling_submission_id_key" ON "sampling"("submission_id");
