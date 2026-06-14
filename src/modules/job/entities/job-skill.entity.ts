/* eslint-disable @typescript-eslint/no-unsafe-return */
// entities/job-skill.entity.ts
import { Entity, ManyToOne } from 'typeorm';
import { Job } from './job.entity';
import { Skill } from '../../skill/entities/skill.entity';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('job_skills')
export class JobSkill extends BaseEntity {
  @ManyToOne(() => Job, (job) => job.jobSkills, { onDelete: 'CASCADE' })
  job!: Job;

  @ManyToOne(() => Skill, (skill) => skill.jobSkills, { onDelete: 'CASCADE' })
  skill!: Skill;
}
