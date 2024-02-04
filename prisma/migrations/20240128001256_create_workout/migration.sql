-- CreateTable
CREATE TABLE "workouts" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "exercise_id" TEXT NOT NULL,
    "series" DECIMAL(65,30) NOT NULL,
    "repetitions" DECIMAL(65,30) NOT NULL,
    "weight" DECIMAL(65,30),
    "note" TEXT,

    CONSTRAINT "workouts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
