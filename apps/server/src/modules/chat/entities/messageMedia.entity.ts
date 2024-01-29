import { Column, Entity, PrimaryColumn } from 'typeorm';
import { expectedFileTypes } from '@shared/types';

@Entity()
export class MessageMediaEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'uuid', nullable: true })
  message: string;

  @Column({ type: 'uuid' })
  path: string;

  @Column({ nullable: true })
  totalChunks?: number;

  @Column({ nullable: true })
  chunksUploaded?: number;

  @Column()
  ext: string;

  @Column({ type: 'varchar', nullable: true })
  thumbnail_path: string | null;

  @Column({ type: 'varchar' })
  type: expectedFileTypes;

  @Column({ type: 'bytea' })
  size: number;
}
