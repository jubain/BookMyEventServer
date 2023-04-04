-- DropForeignKey
ALTER TABLE `SavedEvent` DROP FOREIGN KEY `SavedEvent_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `SavedEvent` DROP FOREIGN KEY `SavedEvent_userId_fkey`;

-- DropForeignKey
ALTER TABLE `SavedVenue` DROP FOREIGN KEY `SavedVenue_userId_fkey`;

-- DropForeignKey
ALTER TABLE `SavedVenue` DROP FOREIGN KEY `SavedVenue_venueId_fkey`;

-- AddForeignKey
ALTER TABLE `SavedEvent` ADD CONSTRAINT `SavedEvent_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SavedEvent` ADD CONSTRAINT `SavedEvent_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SavedVenue` ADD CONSTRAINT `SavedVenue_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SavedVenue` ADD CONSTRAINT `SavedVenue_venueId_fkey` FOREIGN KEY (`venueId`) REFERENCES `Venue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
