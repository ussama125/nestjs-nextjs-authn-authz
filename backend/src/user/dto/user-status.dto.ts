import { IsNotEmpty, IsBoolean } from 'class-validator';

export class UserStatusDto {
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
