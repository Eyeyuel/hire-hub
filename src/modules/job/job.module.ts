import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { JobSkill } from './entities/job-skill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job, JobSkill])],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
