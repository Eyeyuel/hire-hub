// entities/resume.entity.ts
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Application } from '../../application/entities/application.entity';

@Entity('resumes')
export class Resume extends BaseEntity {
  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  summary?: string;

  @Column()
  fileUrl?: string;

  @Column({ type: 'jsonb', nullable: true })
  experiences?: Array<{
    company: string;
    title: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }>;

  @Column({ type: 'jsonb', nullable: true })
  education?: Array<{
    institution: string;
    degree: string;
    field?: string;
    startDate: string;
    endDate?: string;
  }>;

  @Column({ type: 'jsonb', nullable: true })
  skills?: string[]; // for quick reference, also linked via UserSkill

  @ManyToOne(() => User, (user) => user.resumes, { onDelete: 'CASCADE' })
  user!: User;

  @Column({ type: 'uuid' })
  userId!: string;

  @OneToMany(() => Application, (app) => app.resume)
  applications!: Application[];
}
