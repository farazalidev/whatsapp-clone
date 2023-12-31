import { INewMessages } from '@shared/types';
import { MessageEntity } from './message.entity';
import { BeforeInsert, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';

@Entity()
export class UnReadMessagesEntity implements INewMessages {
  @PrimaryColumn()
  id: string = v4();

  @Column()
  user_id: string;

  @Column()
  chat_id: string;

  @OneToMany(() => MessageEntity, (message) => message.id, { cascade: true })
  messages: MessageEntity[];

  @BeforeInsert()
  async initMessages() {
    this.messages = [];
  }
}
