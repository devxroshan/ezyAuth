/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `ProjectUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProjectUser_email_key" ON "ProjectUser"("email");
