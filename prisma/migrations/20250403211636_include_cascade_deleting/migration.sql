-- DropForeignKey
ALTER TABLE "question_attachments" DROP CONSTRAINT "question_attachments_questionId_fkey";

-- DropForeignKey
ALTER TABLE "question_groups" DROP CONSTRAINT "question_groups_formTemplateId_fkey";

-- DropForeignKey
ALTER TABLE "question_options" DROP CONSTRAINT "question_options_questionId_fkey";

-- DropForeignKey
ALTER TABLE "question_triggers" DROP CONSTRAINT "question_triggers_groupId_fkey";

-- DropForeignKey
ALTER TABLE "question_triggers" DROP CONSTRAINT "question_triggers_optionId_fkey";

-- DropForeignKey
ALTER TABLE "question_triggers" DROP CONSTRAINT "question_triggers_questionId_fkey";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_formTemplateId_fkey";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_questionGroupId_fkey";

-- DropForeignKey
ALTER TABLE "sub_brands_templates" DROP CONSTRAINT "sub_brands_templates_subBrandId_fkey";

-- DropForeignKey
ALTER TABLE "sub_brands_templates" DROP CONSTRAINT "sub_brands_templates_templateId_fkey";

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_formTemplateId_fkey" FOREIGN KEY ("formTemplateId") REFERENCES "form_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_questionGroupId_fkey" FOREIGN KEY ("questionGroupId") REFERENCES "question_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_options" ADD CONSTRAINT "question_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_attachments" ADD CONSTRAINT "question_attachments_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_groups" ADD CONSTRAINT "question_groups_formTemplateId_fkey" FOREIGN KEY ("formTemplateId") REFERENCES "form_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_triggers" ADD CONSTRAINT "question_triggers_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "question_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_triggers" ADD CONSTRAINT "question_triggers_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "question_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_triggers" ADD CONSTRAINT "question_triggers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_brands_templates" ADD CONSTRAINT "sub_brands_templates_subBrandId_fkey" FOREIGN KEY ("subBrandId") REFERENCES "sub_brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_brands_templates" ADD CONSTRAINT "sub_brands_templates_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "form_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
