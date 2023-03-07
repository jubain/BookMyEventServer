/*
  Warnings:

  - Added the required column `latitude` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Venue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Venue` ADD COLUMN `latitude` BIGINT NOT NULL,
    ADD COLUMN `longitude` BIGINT NOT NULL;
