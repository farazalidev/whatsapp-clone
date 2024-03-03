import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { v4 } from 'uuid';
import { UserProfileEntity } from './userprofile.entity';
import { SubscriptionEntity } from './subscription.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryColumn({ type: 'uuid' })
  user_id: string = v4();

  @Column()
  name: string;

  @Column({ unique: true, type: 'varchar' })
  email: string;

  @OneToOne(() => UserProfileEntity, (profile) => profile.id, { eager: true, cascade: true, nullable: true })
  @JoinColumn({ name: 'profileId' })
  profile: UserProfileEntity;

  @JoinColumn()
  @OneToMany(() => SubscriptionEntity, (sub) => sub.user, { nullable: true, cascade: true })
  subscription?: SubscriptionEntity;

  @Column({ type: 'boolean', nullable: true, default: false })
  isVerified: boolean = false;

  @Column({ nullable: true })
  registration_otp: string;

  @Column({ nullable: true, type: 'bigint' })
  registration_otp_exp: number;

  @Column({ nullable: true })
  refresh_hash: string;

  @Column({ default: false })
  is_profile_completed: boolean = false;

  // Automatically set to the current timestamp when the entity is first created
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  // Automatically set to the current timestamp when the entity is updated
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
