import { Column, Entity, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';

@Entity()
export class CloudinaryImageEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string = v4();

  @Column()
  public_id: string;

  @Column()
  format: string;
}
