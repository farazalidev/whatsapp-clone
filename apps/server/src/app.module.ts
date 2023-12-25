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
import { MessageGateway } from './gateways/message.gatewat';

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
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    JwtService,
  ],
})
export class AppModule {}
