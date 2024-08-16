import { IsString, MinLength, Matches, IsEmail } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  oldPassword: string;

  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'New Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.',
    },
  )
  newPassword: string;
  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Confirm Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.',
    },
  )
  confirmNewPassword: string;
}
