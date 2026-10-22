import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
<<<<<<< HEAD
import { App } from 'supertest/types.js';
=======
import { App } from 'supertest/types';
>>>>>>> b37f7d0703a18fc5628a260779c78ff87d45ebf7
import { AppModule } from './../src/app.module.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
<<<<<<< HEAD
      .expect('Orquestrador de Pedidos is running!');
=======
      .expect('Hello World!');
>>>>>>> b37f7d0703a18fc5628a260779c78ff87d45ebf7
  });

  afterEach(async () => {
    await app.close();
  });
});
