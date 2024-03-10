import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallEntity } from './entities/call.entity';
import { CallGateway } from './call.gateway';
import { OnlineUsersService } from '../../services/onlineUsers.service';

@Module({ imports: [UserModule, TypeOrmModule.forFeature([CallEntity])], providers: [CallGateway, OnlineUsersService] })
export class CallModule {}
