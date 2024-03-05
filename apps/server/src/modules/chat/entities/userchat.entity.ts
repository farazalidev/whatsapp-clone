import { BeforeInsert, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { MessageEntity } from './message.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity()
export class UserChatEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn()
  chat_for: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.user_id, { eager: true })
  chat_with: UserEntity;

  @OneToMany(() => MessageEntity, (message) => message.chat, { cascade: true, eager: true })
  messages?: MessageEntity[];

  @BeforeInsert()
  async initMessages?() {
    this.messages = [];
  }
}
