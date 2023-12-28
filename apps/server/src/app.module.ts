import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { ChatModule } from './modules/chat/chat.module';
import { LocalUploadModule } from './modules/localupload/localupload.module';
import { MessageGateway } from './gateways/message.gateway';
import { RedisModule } from '@nestjs-modules/ioredis';
import { pubsubService } from './services/pubsub.service';
import { RoomService } from './services/room.service';
import { OnlineUsersService } from './services/onlineUsers.service';
import { UserGateway } from './gateways/user.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '223366',
      database: 'whatsapp',
      synchronize: true,
      autoLoadEntities: true,
      uuidExtension: 'pgcrypto',
    }),
    RedisModule.forRoot({
      type: 'single',
      options: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    LocalUploadModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    MessageGateway,
    UserGateway,
    pubsubService,
    RoomService,
    OnlineUsersService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    JwtService,
  ],
})
export class AppModule {}
