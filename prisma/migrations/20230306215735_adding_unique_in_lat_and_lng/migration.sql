/*
  Warnings:

  - A unique constraint covering the columns `[latitude]` on the table `Venue` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[longitude]` on the table `Venue` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `VenueType` DROP FOREIGN KEY `VenueType_typeId_fkey`;

-- DropForeignKey
ALTER TABLE `VenueType` DROP FOREIGN KEY `VenueType_venueId_fkey`;

-- CreateIndex
CREATE UNIQUE INDEX `Venue_latitude_key` ON `Venue`(`latitude`);

-- CreateIndex
CREATE UNIQUE INDEX `Venue_longitude_key` ON `Venue`(`longitude`);

-- AddForeignKey
ALTER TABLE `VenueType` ADD CONSTRAINT `VenueType_venueId_fkey` FOREIGN KEY (`venueId`) REFERENCES `Venue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VenueType` ADD CONSTRAINT `VenueType_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `Type`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
