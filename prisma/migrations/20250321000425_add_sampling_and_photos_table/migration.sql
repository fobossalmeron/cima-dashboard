-- AlterTable
ALTER TABLE "form_submissions" ADD COLUMN     "first_activation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "traffic" TEXT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "emailVerified" SET DEFAULT false;

-- CreateTable
CREATE TABLE "sampling_traffic" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "sampling_traffic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "etnicity" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "etnicity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "age_range" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "age_range_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gender" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Gender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseIntention" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "PurchaseIntention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consumption_moments" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "consumption_moments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sampling" (
    "id" TEXT NOT NULL,
    "submission_id" TEXT NOT NULL,
    "traffic_id" TEXT NOT NULL,
    "ethnicity_id" TEXT NOT NULL,
    "age_range_id" TEXT NOT NULL,
    "gender_id" TEXT NOT NULL,
    "purchase_intention_id" TEXT NOT NULL,
    "consumption_moment_id" TEXT NOT NULL,
    "net_promoter_score" INTEGER NOT NULL,
    "follow_up" BOOLEAN NOT NULL DEFAULT false,
    "client_comments" TEXT,
    "promotor_comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sampling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photo_types" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "photo_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photos" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,

    CONSTRAINT "photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sampling_traffic_slug_key" ON "sampling_traffic"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "etnicity_slug_key" ON "etnicity"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "age_range_slug_key" ON "age_range"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Gender_slug_key" ON "Gender"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseIntention_slug_key" ON "PurchaseIntention"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "consumption_moments_slug_key" ON "consumption_moments"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "photo_types_slug_key" ON "photo_types"("slug");

-- AddForeignKey
ALTER TABLE "sampling" ADD CONSTRAINT "sampling_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "form_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sampling" ADD CONSTRAINT "sampling_traffic_id_fkey" FOREIGN KEY ("traffic_id") REFERENCES "sampling_traffic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sampling" ADD CONSTRAINT "sampling_ethnicity_id_fkey" FOREIGN KEY ("ethnicity_id") REFERENCES "etnicity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sampling" ADD CONSTRAINT "sampling_age_range_id_fkey" FOREIGN KEY ("age_range_id") REFERENCES "age_range"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sampling" ADD CONSTRAINT "sampling_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "Gender"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sampling" ADD CONSTRAINT "sampling_purchase_intention_id_fkey" FOREIGN KEY ("purchase_intention_id") REFERENCES "PurchaseIntention"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sampling" ADD CONSTRAINT "sampling_consumption_moment_id_fkey" FOREIGN KEY ("consumption_moment_id") REFERENCES "consumption_moments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "photo_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "form_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
