import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { RedisIoAdapter } from './utils/RedisIoAdapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.enableCors({
    credentials: true,
    origin: [process.env.FRONT_END_URL],
  });
  const redisAdapter = new RedisIoAdapter(app);
  await redisAdapter.connectToRedis();

  // TODO: when the server crashes ro down remove all users online and remove all rooms

  app.useWebSocketAdapter(redisAdapter);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(8000);
}
bootstrap();
