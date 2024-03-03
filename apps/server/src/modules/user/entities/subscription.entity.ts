import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';
import { UserEntity } from './user.entity';

@Entity({ name: 'subscription-entity' })
export class SubscriptionEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string = v4();

  @ManyToOne(() => UserEntity, (user) => user.subscription)
  user: UserEntity;

  @Column()
  endpoint: string;

  @Column()
  auth: string;

  @Column()
  p256dh: string;
}
