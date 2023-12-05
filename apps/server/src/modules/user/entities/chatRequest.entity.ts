import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';
import { UserEntity } from './user.entity';

@Entity({ name: 'chat_requests' })
export class ChatRequestEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string = v4();

  @ManyToOne(() => UserEntity, (user) => user.chats_requests)
  acceptor: UserEntity;

  @OneToOne(() => UserEntity, (user) => user.user_id, { eager: true })
  @JoinColumn({ name: 'requester_id' })
  requester_id: UserEntity;

  @Column()
  status: 'pending' | 'accepted' | 'rejected';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  requested_at: Date;
  
}
