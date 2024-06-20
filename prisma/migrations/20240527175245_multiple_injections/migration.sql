/*
  Warnings:

  - You are about to drop the column `apiKey` on the `Endpoint` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Endpoint` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Endpoint" DROP COLUMN "apiKey",
DROP COLUMN "type";

-- CreateTable
CREATE TABLE "Injection" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "endpointId" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Injection_id_key" ON "Injection"("id");

-- AddForeignKey
ALTER TABLE "Injection" ADD CONSTRAINT "Injection_endpointId_fkey" FOREIGN KEY ("endpointId") REFERENCES "Endpoint"("id") ON DELETE SET NULL ON UPDATE CASCADE;
