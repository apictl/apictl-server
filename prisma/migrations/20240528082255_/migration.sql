/*
  Warnings:

  - Added the required column `public_token` to the `Endpoint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Endpoint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `public_token` to the `Injection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Injection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `public_token` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Endpoint" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "public_token" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Injection" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "public_token" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "public_token" TEXT NOT NULL;
