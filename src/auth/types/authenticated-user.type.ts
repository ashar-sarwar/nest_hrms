import { Role } from 'generated/prisma/enums';

export type AuthenticatedUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
};
