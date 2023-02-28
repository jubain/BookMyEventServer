/*
  Warnings:

  - You are about to drop the column `venueId` on the `EventBooking` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `EventBooking` DROP FOREIGN KEY `EventBooking_venueId_fkey`;

-- AlterTable
ALTER TABLE `EventBooking` DROP COLUMN `venueId`;
