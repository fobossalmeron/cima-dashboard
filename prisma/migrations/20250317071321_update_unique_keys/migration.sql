/*
  Warnings:

  - A unique constraint covering the columns `[dashboardId,locationId,representativeId,submitted_at]` on the table `form_submissions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `locations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "dealers_form_submission_id_idx" ON "dealers"("form_submission_id");

-- CreateIndex
CREATE UNIQUE INDEX "form_submissions_dashboardId_locationId_representativeId_su_key" ON "form_submissions"("dashboardId", "locationId", "representativeId", "submitted_at");

-- CreateIndex
CREATE UNIQUE INDEX "locations_code_key" ON "locations"("code");
