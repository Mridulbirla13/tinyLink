/*
  Warnings:

  - You are about to drop the `ClickEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClickEvent" DROP CONSTRAINT "ClickEvent_linkId_fkey";

-- DropTable
DROP TABLE "ClickEvent";
