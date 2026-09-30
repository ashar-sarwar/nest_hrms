/*
  Warnings:

  - The `department` column on the `Employee` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Department" AS ENUM ('ENGINEERING', 'HR', 'FINANCE', 'SALES');

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "department",
ADD COLUMN     "department" "Department";
