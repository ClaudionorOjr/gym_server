-- CreateTable
CREATE TABLE "measurements" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "bust" DECIMAL(65,30) NOT NULL,
    "bicep" DECIMAL(65,30) NOT NULL,
    "forearm" DECIMAL(65,30) NOT NULL,
    "waist" DECIMAL(65,30) NOT NULL,
    "hips" DECIMAL(65,30) NOT NULL,
    "thigh" DECIMAL(65,30) NOT NULL,
    "calf" DECIMAL(65,30) NOT NULL,
    "measurements_taken_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "measurements_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
