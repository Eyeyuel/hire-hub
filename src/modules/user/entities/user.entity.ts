// entities/user.entity.ts
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { SavedJob } from './saved-job.entity';
import { UserSkill } from './user-skill.entity';
import { UserRole } from '../../../common/enums';
import { Application } from '../../application/entities/application.entity';
import { Resume } from '../../resume/entities/resume.entity';
import { Notification } from '../../notification/entities/notification.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  fullName!: string;

  @Column({ default: false })
  isVerified!: boolean;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CANDIDATE })
  role!: UserRole;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ type: 'bytea', nullable: true })
  avatarData?: Buffer; // This will store the binary image data

  @OneToMany(() => Application, (app) => app.user)
  applications!: Application[];

  @OneToMany(() => Resume, (resume) => resume.user)
  resumes!: Resume[];

  @OneToMany(() => SavedJob, (saved: SavedJob) => saved.user)
  savedJobs!: SavedJob[];

  @OneToMany(() => UserSkill, (userSkill) => userSkill.user)
  userSkills!: UserSkill[];

  @OneToMany(() => Notification, (notif) => notif.user)
  notifications!: Notification[];
}
