/*
  Warnings:

  - Added the required column `people` to the `Venue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Venue` ADD COLUMN `people` INTEGER NOT NULL;
