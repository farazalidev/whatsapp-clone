import { Kafka, Message, Partitioners, Producer } from 'kafkajs';
import { IProducer } from './kafka.types';
import { Logger } from '@nestjs/common';
import { sleep } from '../../utils/sleep';

export class KafkaProducer implements IProducer {
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly logger: Logger;

  constructor(
    private readonly topic: string,
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
    this.producer = this.kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });
    this.logger = new Logger(topic);
  }

  async produce(message: Message): Promise<void> {
    await this.producer.send({ topic: this.topic, messages: [message] });
  }

  async connect(): Promise<void> {
    try {
      await this.producer.connect();
    } catch (error) {
      this.logger.error('Failed to connect to Kafka.', error);
      await sleep(5000);
      await this.connect();
    }
  }
  async disconnect() {
    await this.producer.disconnect();
  }
}
