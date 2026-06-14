// entities/application.entity.ts
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Job } from '../../job/entities/job.entity';
import { Resume } from '../../resume/entities/resume.entity';
import { ApplicationStatus } from '../../../common/enums';

@Entity('applications')
export class Application extends BaseEntity {
  @ManyToOne(() => User, (user) => user.applications, { onDelete: 'CASCADE' })
  user!: User;

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => Job, (job) => job.applications, { onDelete: 'CASCADE' })
  job!: Job;

  @Column({ type: 'uuid' })
  jobId!: string;

  @ManyToOne(() => Resume, (resume) => resume.applications, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  resume!: Resume | null;

  @Column({ type: 'uuid', nullable: true })
  resumeId?: string | null;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status!: ApplicationStatus;

  @Column({ type: 'text', nullable: true })
  coverLetter!: string;
}
