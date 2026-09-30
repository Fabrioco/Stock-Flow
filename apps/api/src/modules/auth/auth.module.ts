import { Module } from '@nestjs/common';
import { AuthController } from './presentation/controllers/auth.controller.js';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case.js';
import { UserRepository } from './domain/repositories/user.repository.js';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-auth.repository.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { LoginUseCase } from './application/use-cases/login.use-case.js';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    CreateUserUseCase,
    LoginUseCase,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
})
export default class AuthModule {}
