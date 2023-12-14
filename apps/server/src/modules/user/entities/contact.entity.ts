import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';
import { UserEntity } from './user.entity';

@Entity()
export class ContactEntity {
  @PrimaryColumn()
  id: string = v4();

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'contact' })
  contact: UserEntity;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'contact_for' })
  contact_for: UserEntity;
}
