import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { Department } from 'generated/prisma/enums';
export class CreateEmployeeDto {
  @IsString()
  @Length(3, 100)
  name: string;

  @IsOptional()
  @IsString()
  @Length(10, 15)
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsEnum(Department)
  department: Department;

  @IsString()
  @IsNotEmpty()
  designation: string;

  @IsInt()
  @Min(0)
  salary: number;

  @IsDateString()
  joiningDate: string;
}
