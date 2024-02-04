-- CreateTable
CREATE TABLE "exercises" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "musculature_id" TEXT NOT NULL,
    "equipment" TEXT,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "exercises_name_key" ON "exercises"("name");

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_musculature_id_fkey" FOREIGN KEY ("musculature_id") REFERENCES "msuculatures"("id") ON DELETE CASCADE ON UPDATE CASCADE;
