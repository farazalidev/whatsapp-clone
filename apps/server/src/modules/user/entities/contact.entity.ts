import { Entity, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';
import { UserEntity } from './user.entity';

@Entity()
export class ContactEntity {
  @PrimaryColumn()
  id: string = v4();

  @OneToOne(() => UserEntity, (user) => user.user_id)
  contact_user: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.contacts)
  _user: UserEntity;
}
