import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // CORS 설정
  app.enableCors(configService.get('cors'));

  // 전역 Validation Pipe 설정
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // API 전역 prefix 설정
  app.setGlobalPrefix('api');

  const port = configService.get<number>('port') || 3001;
  await app.listen(port);
}
void bootstrap();
