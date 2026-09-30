import { Body, Controller, Get, Post, UseFilters } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto.js';
import { LoginUseCase } from '../../application/use-cases/login.use-case.js';
import { UserExceptionFilter } from '../filters/user-exception.filter.js';
import { CreateUserDto } from '../dto/create-user.dto.js';
import { UserResponseDto } from '../dto/user-response.dto.js';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case.js';

@ApiTags('auth')
@Controller('auth')
@UseFilters(UserExceptionFilter)
export class AuthController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly login: LoginUseCase,
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

  @Post('login')
  @ApiBody({
    type: LoginDto,
  })
  @ApiCreatedResponse({ type: UserResponseDto })
  async signIn(@Body() dto: LoginDto): Promise<UserResponseDto> {
    const user = await this.login.execute(dto);
    return { id: user.id, name: user.name, email: user.email };
  }
}
