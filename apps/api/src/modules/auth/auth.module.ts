import { Module } from '@nestjs/common';
import { AuthController } from './presentation/controllers/auth.controller.js';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case.js';
import { UserRepository } from './domain/repositories/user.repository.js';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-auth.repository.js';
import { LoginUseCase } from './application/use-cases/login.use-case.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';
import { JwtTokenGenerator } from './infrastructure/services/jwt-token-generator.js';
import { TokenGenerator } from './domain/services/token-generator.js';
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRES_IN') ??
            '7d') as StringValue,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    CreateUserUseCase,
    LoginUseCase,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: TokenGenerator,
      useClass: JwtTokenGenerator,
    }
  ],
})
export default class AuthModule {}
