/*
  Warnings:

  - You are about to alter the column `updated_at` on the `cad_car` table. The data in that column could be lost. The data in that column will be cast from `DateTime(6)` to `DateTime(3)`.
  - You are about to alter the column `updated_at` on the `cad_image` table. The data in that column could be lost. The data in that column will be cast from `DateTime(6)` to `DateTime(3)`.
  - You are about to alter the column `updated_at` on the `cad_service_car` table. The data in that column could be lost. The data in that column will be cast from `DateTime(6)` to `DateTime(3)`.
  - You are about to alter the column `updated_at` on the `cad_service_detail` table. The data in that column could be lost. The data in that column will be cast from `DateTime(6)` to `DateTime(3)`.
  - You are about to alter the column `updated_at` on the `cad_user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(6)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `cad_car` MODIFY `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `cad_image` MODIFY `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `cad_service_car` MODIFY `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `cad_service_detail` MODIFY `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `cad_user` MODIFY `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);
