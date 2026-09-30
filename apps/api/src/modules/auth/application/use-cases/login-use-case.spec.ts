import { User } from '../../domain/entities/user.entity.js';
import {
  CredentialsIncorrect,
  UserNotFound,
} from '../../domain/errors/user.errors.js';
import { UserRepository } from '../../domain/repositories/user.repository.js';
import { CreateUserUseCase } from './create-user.use-case.js';
import { LoginUseCase } from './login.use-case.js';

class InMemoryUserRepository extends UserRepository {
  items: User[] = [];

  async save(user: User): Promise<void> {
    this.items.push(user);
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.items.find((u) => u.email === email) ?? null;
  }
}

describe('LoginUseCase', () => {
  let repository: InMemoryUserRepository;
  let loginUseCase: LoginUseCase;
  let createUserUseCase: CreateUserUseCase;

  const props = {
    name: 'Fabrício Lopes',
    email: 'teste@teste.com',
    password: 'Lopes100503',
  };

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    loginUseCase = new LoginUseCase(repository);
    createUserUseCase = new CreateUserUseCase(repository);
  });

  beforeEach(async () => {
    await createUserUseCase.execute({
      name: props.name,
      email: props.email,
      password: props.password,
    });
  });

  it('should do login', async () => {
    const user: User = await loginUseCase.execute({
      email: props.email,
      password: props.password,
    });

    expect(user.id).toBeDefined();
    expect(user.name).toBe(props.name);
    expect(user.email).toBe(props.email);
  });

  it('rejects wrong password', async () => {
    await expect(
      loginUseCase.execute({ email: props.email, password: '12345678' }),
    ).rejects.toThrow(CredentialsIncorrect);
  });

  it('rejects an email that does not exist — same error as wrong password', async () => {
    await expect(
      loginUseCase.execute({
        email: 'fabricio@dev.com',
        password: props.password,
      }),
    ).rejects.toThrow(CredentialsIncorrect);
  });
});
