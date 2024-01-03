import { Injectable, OnApplicationShutdown, OnModuleDestroy } from '@nestjs/common';
import { OnlineUsersService } from './onlineUsers.service';
import { RoomService } from './room.service';

@Injectable()
export class ShutDownService implements OnApplicationShutdown, OnModuleDestroy {
  constructor(
    private onlineUserService: OnlineUsersService,
    private roomsService: RoomService,
  ) {}

  async onModuleDestroy() {
    await this.roomsService.removeRoomsByPid(process.env.PID, async (err) => {
      if (err) {
        console.log(err);
      }
      console.log(`users has been removed from online rooms list of this PID:${process.env.PID}`);
    });
    await this.onlineUserService.removeUsersByPid(process.env.PID, (err) => {
      if (err) {
        console.log(err);
      }
      console.log(`users has been removed from online list of this PID${process.env.PID}`);
    });
  }
  async onApplicationShutdown() {
    await this.roomsService.removeRoomsByPid(process.env.PID, async (err) => {
      if (err) {
        console.log(err);
      }
      console.log(`users has been removed from online rooms list of this PID:${process.env.PID}`);
    });
    await this.onlineUserService.removeUsersByPid(process.env.PID, (err) => {
      if (err) {
        console.log(err);
      }
      console.log(`users has been removed from online list of this PID${process.env.PID}`);
    });
  }
}
