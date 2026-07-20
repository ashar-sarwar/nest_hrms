import { Prisma } from 'generated/prisma/client';

export const userPublicSelect = {
  id: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;
