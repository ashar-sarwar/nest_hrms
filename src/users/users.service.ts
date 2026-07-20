import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Role } from 'generated/prisma/enums';
import { User } from 'generated/prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { userPublicSelect } from './user-select';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(data: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }): Promise<User> {
    return this.databaseService.user.create({
      data,
    });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.databaseService.user.findUnique({
      where: {
        email,
      },
    });
  }

  findAll() {
    return this.databaseService.user.findMany({
      select: userPublicSelect,
    });
  }

  findById(id: number) {
    return this.databaseService.user.findUnique({
      where: { id },
      select: userPublicSelect,
    });
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return this.databaseService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  remove(id: number): Promise<User> {
    return this.databaseService.user.delete({
      where: {
        id,
      },
    });
  }
}
