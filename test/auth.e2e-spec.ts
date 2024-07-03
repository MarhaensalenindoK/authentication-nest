import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { setupApp } from '../src/setup-app';

describe('Auth Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // setupApp(app);

    await app.init();
  });

  it('Handle Register', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'asda',
        email: 'asda@gmail.com',
        password: 'asd',
      })
      .expect(201)
      .then(({ body }: request.Response) => {
        expect(body.name).toBe('asda');
        expect(body.email).toBe('asda@gmail.com');
      });
  });

  it('Handle Login', async () => {
    const email = 'asd@gmail.com';

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'asd',
        email,
        password: 'asd',
      })
      .expect(201);

    const cookie = response.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
