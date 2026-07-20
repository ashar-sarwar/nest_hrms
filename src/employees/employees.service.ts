import { Injectable, NotFoundException } from '@nestjs/common';
// import { Prisma } from 'generated/prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Role } from 'generated/prisma/enums';
import { userPublicSelect } from 'src/users/user-select';

@Injectable()
export class EmployeesService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createEmployeeDto: CreateEmployeeDto) {
    return this.databaseService.employee.create({
      data: createEmployeeDto,
    });
  }

  async linkUser(employeeId: number, userId: number) {
    const employee = await this.databaseService.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with id ${employeeId} not found.`);
    }

    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found.`);
    }

    return this.databaseService.employee.update({
      where: {
        id: employeeId,
      },
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        user: {
          select: userPublicSelect,
        },
      },
    });
  }
  async findAll(role?: Role) {
    const where = role
      ? {
          user: {
            role,
          },
        }
      : {};

    return this.databaseService.employee.findMany({
      where,
      include: {
        user: {
          select: userPublicSelect,
        },
      },
    });
  }

  async findOne(id: number) {
    const employee = await this.databaseService.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    return employee;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return this.databaseService.employee.update({
      where: { id },
      data: updateEmployeeDto,
    });
  }

  async remove(id: number) {
    return this.databaseService.employee.delete({
      where: { id },
    });
  }
}
