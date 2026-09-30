import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
// import { Prisma } from 'generated/prisma/client';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { Role } from 'generated/prisma/enums';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { AuthenticatedUser } from 'src/auth/types/authenticated-user.type';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { EmployeeQueryDto } from './dto/employee-query.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Post(':employeeId/link-user/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  linkUser(
    @Param('employeeId') employeeId: string,
    @Param('userId') userId: string,
  ) {
    return this.employeesService.linkUser(+employeeId, +userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @GetUser() user: AuthenticatedUser,
    @Query() query: EmployeeQueryDto,
  ) {
    console.log(user);

    return this.employeesService.findAll(query);
  }

  @SkipThrottle() // Skip throttling for this route
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(+id); // convert id to number using unary plus operator
  }
}
