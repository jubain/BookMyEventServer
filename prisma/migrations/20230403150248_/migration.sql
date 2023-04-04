/*
  Warnings:

  - Added the required column `key` to the `EventImages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `EventImages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `EventImages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `EventImages` ADD COLUMN `key` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL,
    ADD COLUMN `url` VARCHAR(191) NOT NULL;
