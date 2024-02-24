import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class OnlineUsersService {
  constructor(@InjectRedis() private redis: Redis) {}
  async addUserToRedis(user_id: string, pid: string): Promise<void> {
    const userListKey = 'online_users';

    // Check if the user list exists
    this.redis.exists(userListKey, (err, exists) => {
      if (err) {
        return;
      }

      if (exists) {
        // User list exists, check if the user is already in the list
        this.redis.hget(userListKey, user_id, (err, existingPid) => {
          if (err) {
            return;
          }

          if (existingPid && existingPid !== pid) {
            // User is already in the list, and the pid has changed
            this.redis.hset(userListKey, user_id, pid);
          } else if (!existingPid) {
            // User is not in the list, add the user
            this.redis.hset(userListKey, user_id, pid);
          } else {
            // User is already in the list, and the pid has not changed
          }
        });
      } else {
        // User list does not exist, create the list and add the user
        this.redis.hset(userListKey, user_id, pid);
      }
    });
  }

  async removeUser(user_id: string, callback: (error: Error | null, removed: boolean) => void): Promise<void> {
    const userListKey = 'online_users';

    // Remove the user with the specified user_id
    await this.redis.hdel(userListKey, user_id, (err, result) => {
      if (err) {
        return callback(err, false);
      }

      // If result is greater than 0, the user was removed
      const removed = result > 0;
      callback(null, removed);
    });
  }

  async getUserPid(user_id: string, callback: (error: Error | null, pid?: string) => void): Promise<void> {
    const userListKey = 'online_users';

    // Retrieve the pid for the given user_id
    await this.redis.hget(userListKey, user_id, (err, pid) => {
      if (err) {
        return callback(err);
      }

      if (!pid) {
        // User not found
        return callback(null, undefined);
      }

      // User found, return the pid
      callback(null, pid);
    });
  }

  async removeUsersByPid(pid: string, callback: (error: Error | null, removedCount?: number) => void): Promise<void> {
    const userListKey = 'online_users';

    // Get all users with the specified pid
    await this.redis.hscan(userListKey, 0, 'MATCH', `*:${pid}`, 'COUNT', 100, async (err, result) => {
      if (err) {
        return callback(err);
      }

      const usersToRemove = result[1];

      if (usersToRemove.length === 0) {
        // No users with the specified pid found
        return callback(null, 0);
      }

      // Remove users with the specified pid
      await this.redis.hdel(userListKey, ...usersToRemove, (err, removedCount) => {
        if (err) {
          return callback(err);
        }

        callback(null, removedCount);
      });
    });
  }
}
