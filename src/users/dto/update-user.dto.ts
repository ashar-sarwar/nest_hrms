import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { Role } from 'generated/prisma/client';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
