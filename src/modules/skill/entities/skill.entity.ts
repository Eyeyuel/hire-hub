// entities/skill.entity.ts
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserSkill } from '../../user/entities/user-skill.entity';
import { JobSkill } from '../../job/entities/job-skill.entity';

@Entity('skills')
export class Skill extends BaseEntity {
  @Column({ unique: true })
  name!: string;

  @OneToMany(() => UserSkill, (userSkill) => userSkill.skill)
  userSkills!: UserSkill[];

  @OneToMany(() => JobSkill, (jobSkill) => jobSkill.skill)
  jobSkills!: JobSkill[];
}
