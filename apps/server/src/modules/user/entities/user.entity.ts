import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { v4 } from 'uuid';
import { UserProfileEntity } from './userprofile.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryColumn()
  user_id: string = v4();

  @Column({ unique: true })
  username: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @OneToOne(() => UserProfileEntity, (profile) => profile.id, { eager: true, cascade: true, nullable: true })
  @JoinColumn()
  profile: UserProfileEntity;

  @Column()
  password: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  isVerified: boolean = false;

  @Column({ nullable: true })
  registration_otp: string;

  @Column({ nullable: true, type: 'bigint' })
  registration_otp_exp: number;

  @Column({ nullable: true })
  refresh_hash: string;

  // Automatically set to the current timestamp when the entity is first created
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  // Automatically set to the current timestamp when the entity is updated
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
