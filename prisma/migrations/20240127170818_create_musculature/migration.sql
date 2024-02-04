-- CreateTable
CREATE TABLE "msuculatures" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "msuculatures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "msuculatures_name_key" ON "msuculatures"("name");
