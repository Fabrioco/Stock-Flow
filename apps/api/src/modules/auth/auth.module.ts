import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case.js';
import { UserRepository } from './domain/repositories/user.repository.js';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-auth.repository.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { GetAllUsersUseCase } from './application/use-cases/get-all-user.use-case.js';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    CreateUserUseCase,
    GetAllUsersUseCase,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
})
export default class AuthModule {}
