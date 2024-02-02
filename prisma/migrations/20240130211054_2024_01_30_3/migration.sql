/*
  Warnings:

  - Added the required column `amount` to the `cad_cost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `cad_cost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `cad_cost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cad_car` MODIFY `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `cad_client` MODIFY `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `cad_cost` ADD COLUMN `amount` BIGINT NOT NULL,
    ADD COLUMN `name` TEXT NOT NULL,
    ADD COLUMN `price` DECIMAL(9, 2) NOT NULL,
    MODIFY `description` TEXT NULL,
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
