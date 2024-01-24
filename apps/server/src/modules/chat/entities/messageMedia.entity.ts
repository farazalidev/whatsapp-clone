import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { MessageEntity } from './message.entity';

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

  @Column({ type: 'uuid' })
  thumbnail_path: string;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'bytea' })
  size: number;
}
