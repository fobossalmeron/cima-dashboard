-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "QuestionGroupType" AS ENUM ('BASIC', 'MATRIX');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('CHECKBOX', 'SELECT', 'MULTISELECT', 'DATE', 'NUMERIC', 'TEXT', 'PHOTO');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'SUPER_ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashboards" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dashboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "form_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "isMandatory" BOOLEAN NOT NULL DEFAULT false,
    "isAutoFill" BOOLEAN NOT NULL DEFAULT false,
    "forImageRecognition" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "formTemplateId" TEXT NOT NULL,
    "questionGroupId" TEXT,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_options" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "question_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_attachments" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "question_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "QuestionGroupType" NOT NULL DEFAULT 'BASIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "formTemplateId" TEXT NOT NULL,

    CONSTRAINT "question_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_triggers" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "groupId" TEXT,
    "optionId" TEXT,

    CONSTRAINT "question_triggers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_tokens" (
    "id" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "fingerprint" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "refresh_token" TEXT,
    "service_client_id" TEXT,
    "expiresIn" INTEGER,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "service_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_brands" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "sub_brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presentations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "presentations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flavors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "flavors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "subBrandId" TEXT,
    "presentationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "flavorId" TEXT,
    "image_url" TEXT,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_metrics" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "sales" INTEGER NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "representatives" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "representatives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "form_submissions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "email" TEXT,
    "locationId" TEXT,
    "mobile_phone" TEXT,
    "notes" TEXT,
    "phone" TEXT,
    "registered" BOOLEAN NOT NULL DEFAULT false,
    "representativeId" TEXT,
    "status" TEXT,
    "tags" TEXT[],
    "end_date" TIMESTAMP(3) NOT NULL,
    "legal_name" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL,
    "form_link" TEXT NOT NULL,
    "total_quantity" INTEGER NOT NULL DEFAULT 0,
    "total_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "form_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_sales" (
    "id" TEXT NOT NULL,
    "submission_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activated_brands" (
    "id" TEXT NOT NULL,
    "submission_id" TEXT NOT NULL,
    "brand_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activated_brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answers" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "value" TEXT NOT NULL,
    "option_id" TEXT,
    "question_id" TEXT NOT NULL,
    "question_key" TEXT NOT NULL,
    "submission_id" TEXT NOT NULL,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "sessions_token_idx" ON "sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "clients_slug_key" ON "clients"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "clients_userId_key" ON "clients"("userId");

-- CreateIndex
CREATE INDEX "clients_userId_idx" ON "clients"("userId");

-- CreateIndex
CREATE INDEX "dashboards_clientId_idx" ON "dashboards"("clientId");

-- CreateIndex
CREATE INDEX "dashboards_templateId_idx" ON "dashboards"("templateId");

-- CreateIndex
CREATE INDEX "questions_formTemplateId_idx" ON "questions"("formTemplateId");

-- CreateIndex
CREATE INDEX "questions_questionGroupId_idx" ON "questions"("questionGroupId");

-- CreateIndex
CREATE INDEX "question_options_questionId_idx" ON "question_options"("questionId");

-- CreateIndex
CREATE INDEX "question_attachments_questionId_idx" ON "question_attachments"("questionId");

-- CreateIndex
CREATE INDEX "question_groups_formTemplateId_idx" ON "question_groups"("formTemplateId");

-- CreateIndex
CREATE INDEX "question_triggers_questionId_idx" ON "question_triggers"("questionId");

-- CreateIndex
CREATE INDEX "question_triggers_groupId_idx" ON "question_triggers"("groupId");

-- CreateIndex
CREATE INDEX "question_triggers_optionId_idx" ON "question_triggers"("optionId");

-- CreateIndex
CREATE UNIQUE INDEX "service_tokens_service_key" ON "service_tokens"("service");

-- CreateIndex
CREATE INDEX "service_tokens_service_idx" ON "service_tokens"("service");

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_key" ON "brands"("name");

-- CreateIndex
CREATE UNIQUE INDEX "brands_slug_key" ON "brands"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "sub_brands_slug_key" ON "sub_brands"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "sub_brands_slug_brandId_key" ON "sub_brands"("slug", "brandId");

-- CreateIndex
CREATE UNIQUE INDEX "presentations_name_key" ON "presentations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "presentations_slug_key" ON "presentations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "flavors_name_key" ON "flavors"("name");

-- CreateIndex
CREATE UNIQUE INDEX "flavors_slug_key" ON "flavors"("slug");

-- CreateIndex
CREATE INDEX "products_brandId_idx" ON "products"("brandId");

-- CreateIndex
CREATE INDEX "products_subBrandId_idx" ON "products"("subBrandId");

-- CreateIndex
CREATE INDEX "products_presentationId_idx" ON "products"("presentationId");

-- CreateIndex
CREATE INDEX "products_flavorId_idx" ON "products"("flavorId");

-- CreateIndex
CREATE UNIQUE INDEX "products_name_brandId_key" ON "products"("name", "brandId");

-- CreateIndex
CREATE INDEX "product_metrics_productId_idx" ON "product_metrics"("productId");

-- CreateIndex
CREATE INDEX "product_metrics_formId_idx" ON "product_metrics"("formId");

-- CreateIndex
CREATE UNIQUE INDEX "locations_code_key" ON "locations"("code");

-- CreateIndex
CREATE UNIQUE INDEX "dealers_form_submission_id_key" ON "dealers"("form_submission_id");

-- CreateIndex
CREATE INDEX "dealers_form_submission_id_idx" ON "dealers"("form_submission_id");

-- CreateIndex
CREATE INDEX "form_submissions_locationId_idx" ON "form_submissions"("locationId");

-- CreateIndex
CREATE INDEX "form_submissions_representativeId_idx" ON "form_submissions"("representativeId");

-- CreateIndex
CREATE INDEX "form_submissions_dashboardId_idx" ON "form_submissions"("dashboardId");

-- CreateIndex
CREATE UNIQUE INDEX "form_submissions_dashboardId_locationId_representativeId_su_key" ON "form_submissions"("dashboardId", "locationId", "representativeId", "submitted_at");

-- CreateIndex
CREATE INDEX "product_sales_submission_id_idx" ON "product_sales"("submission_id");

-- CreateIndex
CREATE INDEX "product_sales_product_id_idx" ON "product_sales"("product_id");

-- CreateIndex
CREATE INDEX "activated_brands_submission_id_idx" ON "activated_brands"("submission_id");

-- CreateIndex
CREATE INDEX "activated_brands_brand_id_idx" ON "activated_brands"("brand_id");

-- CreateIndex
CREATE UNIQUE INDEX "activated_brands_submission_id_brand_id_key" ON "activated_brands"("submission_id", "brand_id");

-- CreateIndex
CREATE INDEX "answers_submission_id_idx" ON "answers"("submission_id");

-- CreateIndex
CREATE INDEX "answers_question_id_idx" ON "answers"("question_id");

-- CreateIndex
CREATE INDEX "answers_option_id_idx" ON "answers"("option_id");

-- CreateIndex
CREATE INDEX "answers_question_key_idx" ON "answers"("question_key");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashboards" ADD CONSTRAINT "dashboards_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashboards" ADD CONSTRAINT "dashboards_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "form_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_formTemplateId_fkey" FOREIGN KEY ("formTemplateId") REFERENCES "form_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_questionGroupId_fkey" FOREIGN KEY ("questionGroupId") REFERENCES "question_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_options" ADD CONSTRAINT "question_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_attachments" ADD CONSTRAINT "question_attachments_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_groups" ADD CONSTRAINT "question_groups_formTemplateId_fkey" FOREIGN KEY ("formTemplateId") REFERENCES "form_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_triggers" ADD CONSTRAINT "question_triggers_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "question_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_triggers" ADD CONSTRAINT "question_triggers_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "question_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_triggers" ADD CONSTRAINT "question_triggers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_brands" ADD CONSTRAINT "sub_brands_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_flavorId_fkey" FOREIGN KEY ("flavorId") REFERENCES "flavors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_presentationId_fkey" FOREIGN KEY ("presentationId") REFERENCES "presentations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_subBrandId_fkey" FOREIGN KEY ("subBrandId") REFERENCES "sub_brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_metrics" ADD CONSTRAINT "product_metrics_formId_fkey" FOREIGN KEY ("formId") REFERENCES "form_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_metrics" ADD CONSTRAINT "product_metrics_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dealers" ADD CONSTRAINT "dealers_form_submission_id_fkey" FOREIGN KEY ("form_submission_id") REFERENCES "form_submissions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "dashboards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_representativeId_fkey" FOREIGN KEY ("representativeId") REFERENCES "representatives"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_sales" ADD CONSTRAINT "product_sales_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "form_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_sales" ADD CONSTRAINT "product_sales_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activated_brands" ADD CONSTRAINT "activated_brands_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "form_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activated_brands" ADD CONSTRAINT "activated_brands_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "question_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "form_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
