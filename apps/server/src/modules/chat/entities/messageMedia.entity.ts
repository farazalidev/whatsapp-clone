import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { MessageEntity } from './message.entity';
import { expectedFileTypes } from '@shared/types';

@Entity()
export class MessageMediaEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @ManyToOne(() => MessageEntity, (message) => message.media)
  message: string;

  @Column({ type: 'uuid' })
  path: string;

  @Column()
  ext: string;

  @Column({ type: 'uuid', nullable: true })
  thumbnail_path: string | null;

  @Column({ type: 'varchar' })
  type: expectedFileTypes;

  @Column({ type: 'bytea' })
  size: number;
}
