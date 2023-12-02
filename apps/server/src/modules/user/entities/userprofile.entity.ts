import { CloudinaryImageEntity } from 'src/modules/upload/entities/cloudinaryimage.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';

@Entity()
export class UserProfileEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string = v4();

  @OneToOne(() => CloudinaryImageEntity, (image) => image.id)
  @JoinColumn()
  profile_pic: CloudinaryImageEntity;

  @Column()
  about: string;
}
