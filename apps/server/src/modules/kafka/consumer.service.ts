import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { IConsumer, KafkajsConsumerOptions } from './kafka.types';
import { KafkaConsumer } from './kafka.comsumer';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly consumers: IConsumer[] = [];

  async consume({ config, onMessage, topic }: KafkajsConsumerOptions) {
    const consumer = new KafkaConsumer(topic, config, process.env.KAFKA_BROKER);
    await consumer.connect();
    await consumer.consume(onMessage);
    this.consumers.push(consumer);
  }

  onApplicationShutdown() {
    for (const consumer of this.consumers) {
      consumer.disconnect();
    }
  }
}
