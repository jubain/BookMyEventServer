/*
  Warnings:

  - You are about to drop the `VenueImages` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `coverImage` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `images` to the `Venue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `VenueImages` DROP FOREIGN KEY `VenueImages_venueId_fkey`;

-- AlterTable
ALTER TABLE `Venue` ADD COLUMN `coverImage` VARCHAR(191) NOT NULL,
    ADD COLUMN `images` JSON NOT NULL;

-- DropTable
DROP TABLE `VenueImages`;
