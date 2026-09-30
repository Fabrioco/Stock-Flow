import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository.js';
import { CreateUserProps, User } from '../../domain/entities/user.entity.js';
import { EmailAlreadyInUseError } from '../../domain/errors/user.errors.js';
import * as argon2 from 'argon2';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly auth: UserRepository) {}

  async execute(input: CreateUserProps): Promise<User> {
    const existing = await this.auth.findByEmail(input.email);
    if (existing) {
      throw new EmailAlreadyInUseError(input.email);
    }

    const passwordHash = await argon2.hash(input.password);

    const user = User.create({
      name: input.name,
      email: input.email,
      password: passwordHash,
    });

    await this.auth.save(user);
    return user;
  }
}
