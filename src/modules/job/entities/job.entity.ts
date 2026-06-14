/* eslint-disable @typescript-eslint/no-unsafe-return */
// entities/job.entity.ts
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { JobSkill } from './job-skill.entity';
import { BaseEntity } from '../../../common/entities/base.entity';
import { EmploymentType, JobStatus } from '../../../common/enums';
import { Company } from '../../company/entities/company.entity';
import { Application } from '../../application/entities/application.entity';
import { SavedJob } from '../../user/entities/saved-job.entity';

@Entity('jobs')
export class Job extends BaseEntity {
  @Column()
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'enum', enum: JobStatus, default: JobStatus.DRAFT })
  status!: JobStatus;

  @Column({ type: 'enum', enum: EmploymentType })
  employmentType!: EmploymentType;

  @Column({ nullable: true })
  location!: string;

  @Column({ nullable: true })
  salaryMin?: number;

  @Column({ nullable: true })
  salaryMax?: number;

  @Column({ nullable: true })
  experienceYears!: number;

  @Column({ type: 'jsonb', nullable: true })
  requirements!: string[]; // e.g., list of strings

  @ManyToOne(() => Company, (company) => company.jobs, { onDelete: 'CASCADE' })
  company!: Company;

  @Column({ type: 'uuid' })
  companyId!: string;

  @OneToMany(() => Application, (app) => app.job)
  applications!: Application[];

  @OneToMany(() => SavedJob, (saved) => saved.job)
  savedByUsers!: SavedJob[];

  @OneToMany(() => JobSkill, (jobSkill) => jobSkill.job)
  jobSkills!: JobSkill[];
}
