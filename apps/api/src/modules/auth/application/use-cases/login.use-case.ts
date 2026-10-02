import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { CredentialsIncorrect } from '../../domain/errors/user.errors.js';
import { UserRepository } from '../../domain/repositories/user.repository.js';
import { TokenGenerator } from '../../domain/services/token-generator.js';
import { LoginDto } from '../../presentation/dto/login.dto.js';

export interface LoginOutput {
  accessToken: string;
  user: { id: string; name: string; email: string };
}

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly repository: UserRepository,
    private readonly tokens: TokenGenerator,
  ) {}

  async execute(input: LoginDto): Promise<LoginOutput> {
    const user = await this.repository.findByEmail(input.email);
    if (!user) {
      throw new CredentialsIncorrect();
    }

    const passwordMatches = await argon2.verify(user.password, input.password);
    if (!passwordMatches) {
      throw new CredentialsIncorrect();
    }

    const accessToken = await this.tokens.sign({
      sub: user.id,
      name: user.name,
      email: user.email,
    });

    return {
      accessToken,
      user: { id: user.id, name: user.name, email: user.email },
    };
  }
}
