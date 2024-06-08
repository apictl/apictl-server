-- AlterTable
ALTER TABLE "Endpoint" ADD COLUMN     "allowedOrigins" TEXT[],
ADD COLUMN     "allowedShaKeys" TEXT[];
