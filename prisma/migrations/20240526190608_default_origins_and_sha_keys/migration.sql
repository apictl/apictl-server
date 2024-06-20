-- AlterTable
ALTER TABLE "Endpoint" ALTER COLUMN "allowedOrigins" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "allowedShaKeys" SET DEFAULT ARRAY[]::TEXT[];
