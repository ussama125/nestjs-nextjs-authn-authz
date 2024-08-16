import { IsObject, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @Matches(/\+?[\d]{10,10}/, {
    message: 'Invalid phone number format. Should be 10 digits.',
  })
  phoneNumber: string;

  @IsOptional()
  @IsObject()
  settings: {}
}
