import { IsString, Matches, IsNotEmpty, MinLength } from 'class-validator';

export class ConfirmRegistrationDto {
  @IsNotEmpty()
  @IsString()
  verificationToken: string;
}
