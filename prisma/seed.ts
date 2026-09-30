import * as process from 'node:process';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient, Role, Department } from '../generated/prisma/client';
import { User } from 'generated/prisma/browser';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // -------------------------
  // Create Users
  // -------------------------

  const users: User[] = [];

  const userData = [
    {
      name: 'Admin User',
      email: 'admin@test.com',
      role: Role.ADMIN,
    },
    {
      name: 'Ali User',

      email: 'ali@test.com',
      role: Role.INTERN,
    },
    {
      name: 'Ahmed User',

      email: 'ahmed@test.com',
      role: Role.INTERN,
    },
    {
      name: 'Sara User',

      email: 'sara@test.com',
      role: Role.INTERN,
    },
    {
      name: 'Fatima User',

      email: 'fatima@test.com',
      role: Role.INTERN,
    },
  ];

  for (const user of userData) {
    const createdUser = await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
      },
    });

    users.push(createdUser);
  }

  // -------------------------
  // Create Employees
  // -------------------------

  const employeeData = [
    {
      name: 'Muhammad Ashar',
      phone: '03000000001',
      address: 'Karachi',
      department: Department.ENGINEERING,
      designation: 'Software Engineer',
      salary: 150000,
      joiningDate: new Date('2024-01-10'),
    },
    {
      name: 'Ali Khan',
      phone: '03000000002',
      address: 'Lahore',
      department: Department.HR,
      designation: 'HR Intern',
      salary: 50000,
      joiningDate: new Date('2025-02-15'),
    },
    {
      name: 'Ahmed Raza',
      phone: '03000000003',
      address: 'Islamabad',
      department: Department.FINANCE,
      designation: 'Finance Intern',
      salary: 60000,
      joiningDate: new Date('2025-03-20'),
    },
    {
      name: 'Sara Ahmed',
      phone: '03000000004',
      address: 'Karachi',
      department: Department.SALES,
      designation: 'Sales Intern',
      salary: 45000,
      joiningDate: new Date('2025-04-12'),
    },
    {
      name: 'Fatima Noor',
      phone: '03000000005',
      address: 'Multan',
      department: Department.ENGINEERING,
      designation: 'Junior Developer',
      salary: 80000,
      joiningDate: new Date('2025-05-05'),
    },
  ];

  // First 5 employees linked with users

  for (let i = 0; i < employeeData.length; i++) {
    await prisma.employee.create({
      data: {
        ...employeeData[i],
        user: {
          connect: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: users[i].id,
          },
        },
      },
    });
  }

  // -------------------------
  // Create remaining 25 employees
  // -------------------------

  const departments = [
    Department.ENGINEERING,
    Department.HR,
    Department.FINANCE,
    Department.SALES,
  ];

  for (let i = 6; i <= 30; i++) {
    await prisma.employee.create({
      data: {
        name: `Employee ${i}`,
        phone: `030000000${i}`,
        address: 'Pakistan',
        department: departments[i % departments.length],
        designation: i % 2 === 0 ? 'Software Engineer' : 'Associate',
        salary: 40000 + i * 3000,
        joiningDate: new Date(
          `2025-${String((i % 12) + 1).padStart(2, '0')}-10`,
        ),
      },
    });
  }

  console.log('Seed completed successfully');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
