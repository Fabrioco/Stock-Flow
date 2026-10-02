import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module.js';
import request from 'supertest';

describe('POST /auth/register (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();

    prisma = app.get(PrismaService);
  });

  afterEach(async () => {
    await prisma.db.orm.public.User.where({}).delete();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Fabrício Lopes',
        email: 'fabricio@stockflow.dev',
        password: 'Lopes100503',
      })
      .expect(201);

    const { user } = response.body;
    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toBe('Fabrício Lopes');
    expect(user.email).toBe('fabricio@stockflow.dev');
  });
});
