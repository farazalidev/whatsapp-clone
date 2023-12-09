import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';
import { UserChatEntity } from './userchat.entity';

@Entity()
export class MessageEntity {
  @PrimaryColumn()
  @ManyToOne(() => UserChatEntity, (chat) => chat.id)
  id: string = v4();

  @Column()
  sender_id: string;

  @Column()
  reciter_id: string;

  @Column()
  content: string;

  @Column()
  is_seen: boolean;

  @Column()
  sended_at: Date;

  @Column()
  seen_at: Date;
}
