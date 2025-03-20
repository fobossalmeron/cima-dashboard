-- CreateTable
CREATE TABLE "answer_options" (
    "id" TEXT NOT NULL,
    "answer_id" TEXT NOT NULL,
    "option_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "answer_options_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "answer_options_answer_id_idx" ON "answer_options"("answer_id");

-- CreateIndex
CREATE INDEX "answer_options_option_id_idx" ON "answer_options"("option_id");

-- CreateIndex
CREATE UNIQUE INDEX "answer_options_answer_id_option_id_key" ON "answer_options"("answer_id", "option_id");

-- AddForeignKey
ALTER TABLE "answer_options" ADD CONSTRAINT "answer_options_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_options" ADD CONSTRAINT "answer_options_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "question_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
