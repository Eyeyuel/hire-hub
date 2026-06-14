// dto/update-user.dto.ts
import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  MinLength,
  IsUrl,
} from 'class-validator';
import { UserRole } from '../../../common/enums';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  fullName?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string; // handle hashing before saving

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
