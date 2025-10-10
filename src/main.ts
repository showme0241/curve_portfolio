import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.use(cookieParser());

  app.use(
    session({
      name: 'sessionId',
      secret: 'SECRET_ID',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: false,
        secure: false, // HTTPS 환경에서만 전송
        sameSite: 'lax', // 동일한 도메인
        maxAge: 1000 * 60 * 60, // 1시간
      },
    }),
  );

  app.setGlobalPrefix('portfolio/api/v1');
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');

  // 실행 주소
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
