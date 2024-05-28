/*
  Warnings:

  - A unique constraint covering the columns `[public_token]` on the table `Endpoint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[public_token]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Endpoint_public_token_key" ON "Endpoint"("public_token");

-- CreateIndex
CREATE UNIQUE INDEX "Project_public_token_key" ON "Project"("public_token");
