/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Type` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Type` MODIFY `name` ENUM('ANY', 'WEDDING', 'CONVENTION', 'SOCIAL', 'NETWORKING', 'CORPORATE', 'FESTIVAL', 'FASHION', 'CLUB') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Type_name_key` ON `Type`(`name`);
