import { Column, Entity, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';

@Entity()
export class UserProfileEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string = v4();

  @Column({ default: 'Hey, i am using whatsapp.' })
  about: string;
}
