/*
  Warnings:

  - You are about to drop the `ProductVariant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OrderItemToProductVariant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ProductVariant" DROP CONSTRAINT "ProductVariant_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_OrderItemToProductVariant" DROP CONSTRAINT "_OrderItemToProductVariant_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_OrderItemToProductVariant" DROP CONSTRAINT "_OrderItemToProductVariant_B_fkey";

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "public"."ProductVariant";

-- DropTable
DROP TABLE "public"."_OrderItemToProductVariant";
