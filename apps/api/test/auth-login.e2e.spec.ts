import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module.js';
import request from 'supertest';

describe('POST /auth/login (E2E)', () => {
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

  it('should do login a user', async () => {
    await request(app.getHttpServer()).post('/auth/register').send({
      name: 'Fabrício Lopes',
      email: 'fabricio@teste.dev',
      password: 'Lopes100503',
    });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'fabricio@teste.dev',
        password: 'Lopes100503',
      })
      .expect(201);
    expect(response.body).toEqual({
      id: expect.any(String),
      name: 'Fabrício Lopes',
      email: 'fabricio@teste.dev',
    });
  });
});
