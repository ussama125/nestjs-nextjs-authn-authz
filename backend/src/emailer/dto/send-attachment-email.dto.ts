import { IsString, IsNotEmpty } from 'class-validator';

export class AttachmentEmailDto {
  @IsNotEmpty()
  @IsString()
  from: string;
  @IsString()
  to: string;
  @IsNotEmpty()
  @IsString()
  subject: string;
  @IsNotEmpty()
  @IsString()
  message: string;
}
