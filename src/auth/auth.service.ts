//auth.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { Prisma, Role, User } from 'generated/prisma/client';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthenticatedUser } from './types/authenticated-user.type';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthenticatedUser> {
    const userData = await this.usersService.findByEmail(email);
    if (!userData) {
      throw new BadRequestException('User not found');
    }
    const isMatch: boolean = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    const validatedUser: AuthenticatedUser = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    };

    return validatedUser;
  }
  async login(user: AuthenticatedUser): Promise<AuthResponseDto> {
    const payload = {
      id: user.id,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
  async register(user: RegisterUserDto): Promise<AuthResponseDto> {
    const existingUser: User | null = await this.usersService.findByEmail(
      user.email,
    );
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser: Prisma.UserCreateInput = {
      ...user,
      role: Role.INTERN,
      password: hashedPassword,
    };
    const createdUser = await this.usersService.create(newUser);

    const authUser: AuthenticatedUser = {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role,
    };

    return this.login(authUser);
  }
}
