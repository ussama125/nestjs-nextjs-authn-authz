import { IsString, MinLength, Matches } from 'class-validator';

export class ChangePasswordDto {

    @IsString()
    @MinLength(8)
    currentPassword: string;

    @IsString()
    @MinLength(8)
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
            message:
                'Confirm Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.',
        },
    )
    newPassword: string;
}
