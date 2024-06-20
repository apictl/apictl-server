/*
  Warnings:

  - You are about to drop the column `key` on the `Endpoint` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Endpoint" DROP COLUMN "key",
ALTER COLUMN "blackListedCountries" SET DEFAULT ARRAY[]::TEXT[];
