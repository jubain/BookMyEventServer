-- DropForeignKey
ALTER TABLE `EventType` DROP FOREIGN KEY `EventType_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `EventType` DROP FOREIGN KEY `EventType_typeEventId_fkey`;

-- AddForeignKey
ALTER TABLE `EventType` ADD CONSTRAINT `EventType_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventType` ADD CONSTRAINT `EventType_typeEventId_fkey` FOREIGN KEY (`typeEventId`) REFERENCES `TypeEvent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
