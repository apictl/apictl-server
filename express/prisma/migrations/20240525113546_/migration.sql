/*
  Warnings:

  - You are about to drop the column `injectionTypeId` on the `Endpoint` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Endpoint_injectionTypeId_key";

-- AlterTable
ALTER TABLE "Endpoint" DROP COLUMN "injectionTypeId";
