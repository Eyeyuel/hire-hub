/* eslint-disable @typescript-eslint/no-unsafe-return */
// entities/user-skill.entity.ts
import { Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Skill } from '../../skill/entities/skill.entity';

@Entity('user_skills')
export class UserSkill extends BaseEntity {
  @ManyToOne(() => User, (user) => user.userSkills, { onDelete: 'CASCADE' })
  user!: User;

  @ManyToOne(() => Skill, (skill) => skill.userSkills, { onDelete: 'CASCADE' })
  skill!: Skill;
}
