/*
  Warnings:

  - A unique constraint covering the columns `[url,projectId]` on the table `Endpoint` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Endpoint_url_key";

-- CreateIndex
CREATE UNIQUE INDEX "Endpoint_url_projectId_key" ON "Endpoint"("url", "projectId");
