// enums/user-role.enum.ts
export enum UserRole {
  ADMIN = 'admin',
  RECRUITER = 'recruiter',
  CANDIDATE = 'candidate',
}

// enums/job-status.enum.ts
export enum JobStatus {
  DRAFT = 'draft',
  OPEN = 'open',
  CLOSED = 'closed',
}

// enums/employment-type.enum.ts
export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  INTERNSHIP = 'internship',
}

// enums/application-status.enum.ts
export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWING = 'reviewing',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted',
}
