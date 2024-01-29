/*
  Warnings:

  - Made the column `client_id` on table `cad_car` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `cad_car` DROP FOREIGN KEY `cad_car_client_id_fkey`;

-- AlterTable
ALTER TABLE `cad_car` MODIFY `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    MODIFY `client_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `cad_client` MODIFY `phone` BIGINT NOT NULL,
    MODIFY `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `cad_image` MODIFY `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `cad_parts` MODIFY `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `cad_service_car` MODIFY `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `cad_service_detail` MODIFY `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `cad_user` MODIFY `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `lst_type_service` MODIFY `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `cad_car` ADD CONSTRAINT `cad_car_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `cad_client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
