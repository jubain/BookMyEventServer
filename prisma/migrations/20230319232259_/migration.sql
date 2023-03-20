/*
  Warnings:

  - You are about to drop the column `coverImage` on the `Venue` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Venue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Venue` DROP COLUMN `coverImage`,
    DROP COLUMN `images`;

-- CreateTable
CREATE TABLE `VenueImages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `venueId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VenueImages` ADD CONSTRAINT `VenueImages_venueId_fkey` FOREIGN KEY (`venueId`) REFERENCES `Venue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
