import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository.js';
import { LoginDto } from '../../presentation/dto/login.dto.js';
import { CredentialsIncorrect } from '../../domain/errors/user.errors.js';
import * as argon2 from 'argon2';

@Injectable()
export class LoginUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(input: LoginDto) {
    const existing = await this.repository.findByEmail(input.email);
    if (!existing) {
      throw new CredentialsIncorrect();
    }

    const verifyPassword = await argon2.verify(
      existing.password,
      input.password,
    );
    if (!verifyPassword) {
      throw new CredentialsIncorrect();
    }

    return existing;
  }
}
