import { Consumer, Kafka, KafkaMessage, ConsumerSubscribeTopic, ConsumerConfig } from 'kafkajs';
import { IConsumer } from './kafka.types';
import { sleep } from '../../utils/sleep';
import { Logger } from '@nestjs/common';
import * as retry from 'async-retry';

export class KafkaConsumer implements IConsumer {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;
  private readonly logger: Logger;

  constructor(
    private readonly topic: ConsumerSubscribeTopic,
    config: ConsumerConfig,
    broker: string,
  ) {
    this.kafka = new Kafka({
      brokers: [broker],
      ssl: process.env.NODE_ENV == 'development' ? false : true,
      // sasl: {
      //   mechanism: 'scram-sha-256',
      //   username: process.env.KAFKA_USER_NAME,
      //   password: process.env.KAFKA_PASSWORD,
      // },
    });
    this.consumer = this.kafka.consumer(config);
    this.logger = new Logger(`${topic.topic}-${config.groupId}`);
  }

  async consume(onMessage: (message: KafkaMessage) => Promise<void>): Promise<void> {
    await this.consumer.subscribe(this.topic);
    await this.consumer.run({
      eachMessage: async ({ message, partition }) => {
        this.logger.debug(`Processing message partition: ${partition}`);
        try {
          await retry(async () => onMessage(message), {
            onRetry: (error, attempt) => this.logger.error(`Error consuming message, executing retry ${attempt}/3...`, error),
          });
        } catch (error) {
          this.logger.error('Error consuming message. Adding to dead letter queue...', error);
          this.addMessageToDlq(message);
        }
      },
    });
  }

  private async addMessageToDlq(message: KafkaMessage) {
    // TODO: Adding message to DLQ
  }

  async connect(): Promise<void> {
    try {
      await this.consumer.connect();
    } catch (error: any) {
      this.logger.error('Failed to connect to kafka', error);
      await sleep(5000);
      await this.connect();
    }
  }
  async disconnect(): Promise<void> {
    await this.consumer.disconnect();
  }
}
