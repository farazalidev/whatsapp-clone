import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';
import { UserEntity } from '../../user/entities/user.entity';

@Entity()
export class CallEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string = v4();

  @ManyToOne(() => UserEntity)
  caller: UserEntity;

  @ManyToOne(() => UserEntity)
  callee: UserEntity;

  @Column()
  call_status: ICallStatus;

  @Column()
  call_type: ICallType;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  ended_at: Date;
}

export type ICallStatus = 'missed' | 'answered';
export type ICallType = 'voice' | 'video';
