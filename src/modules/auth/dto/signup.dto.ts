import { IsEmail, IsIn, IsNotEmpty, Matches, MinLength } from 'class-validator';
import { UserRole } from '../../../common/enums';

const ALLOWED_ROLES = [UserRole.CANDIDATE, UserRole.RECRUITER];

export class SignUpDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Password must contain at least one uppercase letter and one number',
  })
  password!: string;

  // validate the password and confirmPassword fields match
  // @IsNotEmpty()
  // @Matches(/^(?=.*[A-Z])(?=.*\d)/) // same rule as password
  // confirmPassword!: string;

  @IsIn(ALLOWED_ROLES, { message: 'Role must be candidate or recruiter' })
  role?: UserRole; // type matches the entity

  @IsNotEmpty()
  @MinLength(2, { message: 'Full name must be at least 2 characters' })
  fullName!: string;
}
