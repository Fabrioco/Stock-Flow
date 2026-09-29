import { Body, Controller, Get, Post, UseFilters } from '@nestjs/common';
import type { CreateUserProps, User } from './domain/entities/user.entity.js';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case.js';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { UserExceptionFilter } from './presentation/filters/user-exception.filter.js';
import { UserResponseDto } from './presentation/dto/user-response.dto.js';
import { CreateUserDto } from './presentation/dto/create-user.dto.js';
import { GetAllUsersUseCase } from './application/use-cases/get-all-user.use-case.js';

@ApiTags('auth')
@Controller('auth')
@UseFilters(UserExceptionFilter)
export class AuthController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly getAllUsers: GetAllUsersUseCase,
  ) {}

  @Post('register')
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiCreatedResponse({ type: UserResponseDto })
  async register(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.createUser.execute(dto);
    return { id: user.id, name: user.name, email: user.email };
  }

  @Get('all')
  async getAll(): Promise<User[] | []> {
    const users = await this.getAllUsers.execute();
    return users;
  }
}
