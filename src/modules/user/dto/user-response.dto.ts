import { UserRole } from '../../../common/enums';

export class ProfileResponseDto {
  id!: string;
  email!: string;
  fullName!: string;
  role!: UserRole;
  isVerified!: boolean;
  avatarUrl?: string;
  createdAt!: Date;
  updatedAt!: Date;
}
