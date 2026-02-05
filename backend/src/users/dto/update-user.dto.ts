import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsIn,
  MinLength,
  IsUrl,
  IsDateString,
} from 'class-validator';

export class UpdateUserDto {
  @IsMongoId({ message: 'Invalid ObjectId format' })
  @IsNotEmpty({ message: '_id is required' })
  _id: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsUrl()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  @IsIn(['local', 'google', 'facebook'], {
    message: 'account_type must be local, google or facebook',
  })
  account_type?: string;

  @IsString()
  @IsOptional()
  @IsIn(['user', 'admin', 'moderator'], {
    message: 'role must be user, admin or moderator',
  })
  role?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsString()
  @IsOptional()
  code_id?: string;

  @IsDateString()
  @IsOptional()
  code_expired?: Date;
}

export class AssignRoleDto {
  @IsString()
  @IsNotEmpty({ message: 'Role is required' })
  @IsIn(['ADMIN', 'SALES', 'MARKETING', 'ACCOUNTANT', 'SUPPORT'], {
    message: 'Role must be ADMIN, SALES, MARKETING, ACCOUNTANT, or SUPPORT',
  })
  role: string;
}

export class UpdatePermissionsDto {
  @IsNotEmpty({ message: 'Permissions array is required' })
  permissions: string[];
}
