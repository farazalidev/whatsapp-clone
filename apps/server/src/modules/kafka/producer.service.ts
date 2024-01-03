import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { IProducer } from './kafka.types';
import { Message } from 'kafkajs';
import { KafkaProducer } from './kafka.producer';

@Injectable()
export class ProducerService implements OnApplicationShutdown {
  private readonly producers = new Map<string, IProducer>();

  async produce(topic: string, message: Message) {
    const producer = await this.getProducer(topic);
    try {
      await producer.produce(message);
    } catch (error) {
      console.log('🚀 ~ file: producer.service.ts:16 ~ ProducerService ~ produce ~ error:', error);
    }
  }

  private async getProducer(topic: string) {
    let producer = this.producers.get(topic);
    if (!producer) {
      producer = new KafkaProducer(topic, process.env.KAFKA_BROKER);
      await producer.connect();
      this.producers.set(topic, producer);
    }
    return producer;
  }

  async onApplicationShutdown() {
    for (const producer of this.producers.values()) {
      await producer.disconnect();
    }
  }
}
