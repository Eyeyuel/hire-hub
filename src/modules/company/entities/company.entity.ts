// entities/company.entity.ts
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Job } from '../../job/entities/job.entity';

@Entity('companies')
export class Company extends BaseEntity {
  @Column()
  name!: string;

  @Column({ nullable: true })
  logoUrl!: string;

  @Column({ nullable: true })
  website!: string;

  @Column({ nullable: true, type: 'text' })
  description!: string;

  @OneToMany(() => Job, (job) => job.company)
  jobs!: Job[];
}
