import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { expectedFileTypes } from '@shared/types';
import { MessageEntity } from './message.entity';

@Entity()
export class MessageMediaEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @OneToOne(() => MessageEntity, (message) => message.media, { onDelete: 'CASCADE' })
  message: string;

  @Column({ type: 'uuid' })
  path: string;

  @Column({ nullable: true })
  totalChunks?: number;

  @Column({ nullable: true })
  chunksUploaded?: number;

  @Column()
  ext: string;

  @Column({ nullable: true })
  height: number | null;

  @Column({ nullable: true })
  width: number | null;

  @Column({ nullable: true })
  original_name: string | null;

  @Column({ type: 'varchar', nullable: true })
  thumbnail_path: string | null;

  @Column({ type: 'varchar' })
  type: expectedFileTypes;

  @Column({ type: 'bigint' })
  size: number;
}
