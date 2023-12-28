import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class pubsubService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async pub(channel: string | Buffer, message: string | Buffer) {
    await this.redis.publish(channel, message);
  }

 async sub(channel: string, callback: (message: string) => void) {
    this.redis.on('message', async(chan, message) => {
      if (chan === channel) {
        callback(message);
      }
    });
  }
}
