import { PrismaService } from '../../../../prisma/prisma.service.js';
import { PrismaUserRepository } from './prisma-auth.repository.js';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case.js';

describe('PrismaAuthRepository (integration)', () => {
  let prisma: PrismaService;
  let repository: PrismaUserRepository;
  let useCase: CreateUserUseCase;

  beforeAll(() => {
    prisma = new PrismaService();
    repository = new PrismaUserRepository(prisma);
    useCase = new CreateUserUseCase(repository);
  });
  afterEach(async () => {
    await prisma.db.orm.public.User.where({}).delete();
  });

  afterAll(async () => {
    await prisma.onModuleDestroy();
  });

  it('creates a user and persists it in PostgreSQL', async () => {
    const user = await useCase.execute({
      name: 'Fabrício Lopes',
      email: 'fabricio@test.com',
      password: 'Lopes100503',
    });
    const saved = await repository.findByEmail('fabricio@test.com');

    expect(saved).not.toBeNull();
    expect(saved?.id).toBe(user.user.id);
    expect(saved?.email).toBe('fabricio@test.com');
    expect(saved?.password).not.toBe('Lopes100503');
  });
});
