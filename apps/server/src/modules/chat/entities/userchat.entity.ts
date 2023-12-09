import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';
import { MessageEntity } from './message.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Entity()
export class UserChatEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string = v4();

  @ManyToOne(() => UserEntity, (user) => user.chats)
  user: UserEntity;

  @Column()
  is_online: boolean;

  @OneToMany(() => MessageEntity, (message) => message.id, { cascade: true, eager: true })
  messages: MessageEntity[];
}
