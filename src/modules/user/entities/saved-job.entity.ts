// entities/saved-job.entity.ts
import { Entity, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Job } from '../../job/entities/job.entity';

@Entity('saved_jobs')
export class SavedJob extends BaseEntity {
  /* eslint-disable @typescript-eslint/no-unsafe-return */
  @ManyToOne(() => User, (user: User) => user.savedJobs, {
    onDelete: 'CASCADE',
  })
  user!: User;

  @ManyToOne(() => Job, (job: Job) => job.savedByUsers, { onDelete: 'CASCADE' })
  job!: Job;

  @CreateDateColumn()
  savedAt!: Date;
}
