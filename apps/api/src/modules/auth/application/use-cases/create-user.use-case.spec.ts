import { User } from '../../domain/entities/user.entity.js';
import { EmailAlreadyInUseError } from '../../domain/errors/user.errors.js';
import { UserRepository } from '../../domain/repositories/user.repository.js';
import { CreateUserUseCase } from './create-user.use-case.js';

class InMemoryUserRepository extends UserRepository {
  items: User[] = [];

  async save(user: User): Promise<void> {
    this.items.push(user);
  }

  async findByEmail(email: string) {
    return this.items.find((u) => u.email === email) ?? null;
  }

  async getAllUsers(): Promise<User[] | []> {
    return this.items;
  }
}

describe('CreateUserUseCase', () => {
  let repository: InMemoryUserRepository;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    useCase = new CreateUserUseCase(repository);
  });

  it('should create a user', async () => {
    const user: User = await useCase.execute({
      name: 'John Dow',
      email: 'teste@teste.com',
      passwordHash: 'Lopes100503',
    });

    expect(user.email).toBe('teste@teste.com');
    expect(user.passwordHash).not.toBe('Lopes100503');
  });

  it('should show email already in use', async () => {
    const email = 'email@teste.com';
    await useCase.execute({
      name: 'user teste',
      email,
      passwordHash: 'teste123',
    });

    await expect(
      useCase.execute({
        name: 'user teste',
        email,
        passwordHash: 'teste123',
      }),
    ).rejects.toThrow(EmailAlreadyInUseError);
  });
});
