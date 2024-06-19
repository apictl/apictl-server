-- AlterTable
ALTER TABLE "Endpoint" ADD COLUMN     "blackListedPaths" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "whiteListedPaths" TEXT[] DEFAULT ARRAY[]::TEXT[];
