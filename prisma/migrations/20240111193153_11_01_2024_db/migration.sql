/*
  Warnings:

  - You are about to drop the column `service_id` on the `cad_image` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `cad_service_car` table. All the data in the column will be lost.
  - Added the required column `service_detail_id` to the `cad_image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `cad_image` DROP FOREIGN KEY `cad_image_service_id_fkey`;

-- AlterTable
ALTER TABLE `cad_image` DROP COLUMN `service_id`,
    ADD COLUMN `service_detail_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `cad_service_car` DROP COLUMN `description`;

-- CreateTable
CREATE TABLE `cad_service_detail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,
    `price` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `service_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cad_service_detail` ADD CONSTRAINT `cad_service_detail_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `cad_service_car`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cad_image` ADD CONSTRAINT `cad_image_service_detail_id_fkey` FOREIGN KEY (`service_detail_id`) REFERENCES `cad_service_detail`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
