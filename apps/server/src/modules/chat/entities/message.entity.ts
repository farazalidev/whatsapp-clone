import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';
import { UserEntity } from '../../user/entities/user.entity';
import { UserChatEntity } from './userchat.entity';

@Entity()
export class MessageEntity {
  @PrimaryColumn()
  id: string = v4();

  @ManyToOne(() => UserEntity, (user) => user.user_id, { eager: true })
  @JoinColumn({ name: 'from' })
  from: UserEntity;

  @Column()
  content: string;

  @ManyToOne(() => UserEntity, { nullable: true })
  clear_for: UserEntity;

  @ManyToOne(() => UserChatEntity, (chat) => chat.messages)
  chat: UserChatEntity;

  @Column({ nullable: true })
  is_seen: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  sended_at: Date;

  @Column({ nullable: true })
  seen_at: Date;
}
