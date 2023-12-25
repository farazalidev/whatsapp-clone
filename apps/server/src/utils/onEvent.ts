import { SubscribeMessage } from '@nestjs/websockets';
import { ClientToServerEvents } from '@shared/types';

export const onEvent = (eventName: keyof ClientToServerEvents) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SubscribeMessage(eventName)(target, propertyKey, descriptor);
  };
};
