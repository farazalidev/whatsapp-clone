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
        console.error('Error checking existence of user list:', err);
        return;
      }

      if (exists) {
        // User list exists, check if the user is already in the list
        this.redis.hget(userListKey, user_id, (err, existingPid) => {
          if (err) {
            console.error('Error checking existing user in the list:', err);
            return;
          }

          if (existingPid && existingPid !== pid) {
            // User is already in the list, and the pid has changed
            console.log(`Updating pid for user ${user_id}`);
            this.redis.hset(userListKey, user_id, pid);
          } else if (!existingPid) {
            // User is not in the list, add the user
            console.log(`Adding user ${user_id} to the list`);
            this.redis.hset(userListKey, user_id, pid);
          } else {
            // User is already in the list, and the pid has not changed
            console.log(`User ${user_id} already in the list with the same pid`);
          }
        });
      } else {
        // User list does not exist, create the list and add the user
        console.log(`Creating user list and adding user ${user_id}`);
        this.redis.hset(userListKey, user_id, pid);
      }
    });
  }

  async removeUser(user_id: string, callback: (error: Error | null, removed: boolean) => void): Promise<void> {
    const userListKey = 'online_users';

    // Remove the user with the specified user_id
    await this.redis.hdel(userListKey, user_id, (err, result) => {
      if (err) {
        console.error('Error removing user:', err);
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
}
