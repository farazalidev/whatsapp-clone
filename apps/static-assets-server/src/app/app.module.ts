import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { LocalUploadModule } from 'src/modules/localupload/localupload.module';
import { UserEntity } from '@server/modules/user/entities/user.entity';
import { UserProfileEntity } from '@server/modules/user/entities/userprofile.entity';
import { APP_GUARD } from '@nestjs/core';
import { Upload_Guard } from 'src/guards/upload.guard';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER_NAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.DATA_BASE_NAME,
      synchronize: true,
      autoLoadEntities: true,
      uuidExtension: 'pgcrypto',
    }),
    TypeOrmModule.forFeature([UserEntity, UserProfileEntity]),
    MulterModule.register({
      dest: './../../uploads/',
    }),
    LocalUploadModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: Upload_Guard,
    },
  ],
})
export class AppModule {}
