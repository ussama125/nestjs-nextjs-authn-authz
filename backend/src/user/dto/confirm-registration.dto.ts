import { IsString, Matches, IsNotEmpty, MinLength } from 'class-validator';

export class ConfirmRegistrationDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;
  @IsNotEmpty()
  @IsString()
  lastName: string;
  @Matches(/\+?[\d]{10,10}/, {
    message: 'Invalid phone number format. Should be 10 digits.',
  })
  phoneNumber: string;
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
  @IsNotEmpty()
  @IsString()
  verificationToken: string;
}
