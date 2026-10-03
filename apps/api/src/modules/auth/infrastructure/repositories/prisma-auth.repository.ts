import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository.js';
import { PrismaService } from '../../../../prisma/prisma.service.js';
import { User } from '../../domain/entities/user.entity.js';

@Injectable()
export class PrismaUserRepository extends UserRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async save(user: User): Promise<void> {
    await this.prisma.db.orm.public.User.create({
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.password,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.prisma.db.orm.public.User.where({ email }).first();
    if (!row) return null;

    return User.restore({
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.passwordHash, //aqui é PasswordHash porque ta no banco de dados
    });
  }
}
