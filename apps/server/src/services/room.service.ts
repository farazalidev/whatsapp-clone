import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RoomService {
  constructor(@InjectRedis() private redis: Redis) {}

  async joinOrCreateRoom(room_id: string, user_id: string, user_pid: string) {
    const key = `room:${room_id}`;

    // Check if the user is already in another room
    const userInRoom = await this.findUserRoom(user_id);

    if (userInRoom) {
      // User is already in another room, remove them before joining or creating a new room
      await this.removeUserFromRoom(userInRoom.room_id, user_id);
    }

    // Check if the room exists
    await this.redis.exists(key, async (err, exists) => {
      if (err) {
        return;
      }

      if (exists) {
        // Room exists, check if the user is already in the room
        await this.redis.hget(key, 'users', async (err, usersJSON) => {
          if (err) {
            return;
          }

          const users = (await JSON.parse(usersJSON)) || [];

          if (users.includes(user_id)) {
            // User already in the room, skip
          } else {
            // User not in the room, add the user and their pid
            users.push(user_id);
            const updatedData = {
              users: JSON.stringify(users),
              [`pid:${user_id}`]: user_pid,
            };

            await this.redis.hmset(key, updatedData, (err) => {
              if (err) {
                throw new Error('Error');
              }
            });
          }
        });
      } else {
        // Room doesn't exist, create a new room and add the user with their pid
        const data = {
          users: JSON.stringify([user_id]),
          [`pid:${user_id}`]: user_pid,
        };

        await this.redis.hmset(key, data, (err) => {
          if (err) {
            throw new Error('Error');
          }
        });
      }
    });
  }

  async findUserRoom(user_id: string): Promise<{ room_id: string } | null> {
    return new Promise((resolve, reject) => {
      this.redis.keys('room:*', async (err, roomKeys) => {
        if (err) {
          reject(new Error(`Error finding user room: ${err}`));
          return;
        }

        for (const roomKey of roomKeys) {
          const room_id = roomKey.split(':')[1];

          // Check if the user is in the current room
          await this.redis.hget(roomKey, 'users', (err, usersJSON) => {
            if (err) {
              return;
            }

            const users = JSON.parse(usersJSON) || [];

            if (users?.includes(user_id)) {
              resolve({ room_id });
            }
          });
        }

        resolve(null); // User not found in any room
      });
    });
  }

  async isUserInTheRoom(room_id: string, user_id: string): Promise<boolean> {
    const key = `room:${room_id}`;

    return new Promise((resolve, reject) => {
      this.redis.exists(key, async (err, exists) => {
        if (err) {
          reject(new Error('Error checking room existence'));
          return;
        }

        if (exists) {
          await this.redis.hget(key, 'users', async (err, usersJson) => {
            if (err) {
              reject(new Error('Error while getting users data'));
              return;
            }

            const usersArray = JSON.parse(usersJson);

            if (Array.isArray(usersArray) && usersArray.includes(user_id)) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        } else {
          resolve(false);
        }
      });
    });
  }

  async removeUserFromRoom(room_id: string, user_id: string) {
    const key = `room:${room_id}`;

    // Check if the room exists
    await this.redis.exists(key, async (err, exists) => {
      if (err) {
        return;
      }

      if (exists) {
        // Room exists, remove the user
        await this.redis.hgetall(key, async (err, roomData) => {
          if (err) {
            return;
          }

          const usersJSON = roomData['users'];
          const users = JSON.parse(usersJSON) || [];

          const index = users.indexOf(user_id);
          if (index !== -1) {
            // Remove the user from the array
            users.splice(index, 1);

            if (users.length > 0) {
              // Update the room with the updated user list
              await this.redis.hset(key, 'users', JSON.stringify(users), (err) => {
                if (err) {
                  console.error(`Error updating users in room: ${err}`);
                }
              });
            } else {
              // No users left, delete the entire room
              await this.redis.del(key, (err) => {
                if (err) {
                  console.error(`Error deleting room: ${err}`);
                }
              });
            }
          }
        });
      }
    });
  }
  async removeAllUserRooms(user_id: string) {
    const roomKeys = await this.redis.keys('room:*');

    const promises = roomKeys.map(async (roomKey) => {
      const room_id = roomKey.split(':')[1];
      await this.removeUserFromRoom(room_id, user_id);
    });

    await Promise.all(promises);
  }

  async removeRoomsByPid(pid: string, callback: (error: Error | null, removedCount?: number) => void): Promise<void> {
    const roomKeys = await this.redis.keys('room:*');

    let removedCount = 0;

    const promises = roomKeys.map(async (roomKey) => {
      await this.redis.hget(roomKey, 'users', async (err, usersJSON) => {
        if (err) {
          return;
        }

        const users = JSON.parse(usersJSON) || [];

        if (users.includes(`pid:${pid}`)) {
          // The specified PID is in the room, remove the entire room
          await this.redis.del(roomKey, (err) => {
            if (err) {
              console.error(`Error deleting room ${roomKey}: ${err}`);
            } else {
              removedCount++;
            }
          });
        }
      });
    });

    await Promise.all(promises);

    callback(null, removedCount);
  }
}
