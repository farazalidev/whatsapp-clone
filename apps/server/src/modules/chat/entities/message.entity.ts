import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { UserChatEntity } from './userchat.entity';
import { expectedFileTypes } from '@shared/types';
import { MessageMediaEntity } from './messageMedia.entity';

@Entity()
export class MessageEntity {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.user_id, { eager: true })
  @JoinColumn({ name: 'from' })
  from: UserEntity;

  @Column({ nullable: true, type: 'varchar' })
  messageType: MediaMessageType;

  @OneToMany(() => MessageMediaEntity, (messageMedia) => messageMedia.message, { eager: true })
  media: MessageEntity | null;

  @Column()
  content: string;

  @ManyToOne(() => UserEntity, { nullable: true })
  clear_for: UserEntity | null;

  @ManyToOne(() => UserChatEntity, (chat) => chat.messages)
  chat?: UserChatEntity;

  @Column({ nullable: true })
  is_seen: boolean;

  @Column({ nullable: true })
  sended: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  sended_at: Date;

  @Column({ nullable: true })
  received_at: Date | null;

  @Column({ nullable: true })
  seen_at: Date | null;
}

type MediaMessageType = expectedFileTypes | 'text';
