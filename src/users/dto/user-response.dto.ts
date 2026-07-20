import { Role } from 'generated/prisma/client';

export class UserResponseDto {
  id: number;
  name: string;
  email: string;
  role: Role;
}
