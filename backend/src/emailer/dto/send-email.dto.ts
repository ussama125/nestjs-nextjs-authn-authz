import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class SendEmailDto {
  @IsNotEmpty()
  @IsString()
  sender: string;
  // @IsOptional()
  // @IsArray()
  // to: string[];
  // @IsOptional()
  // @IsArray()
  // cc: string[];
  @IsNotEmpty()
  @IsArray()
  bcc: string[];
  @IsNotEmpty()
  @IsString()
  subject: string;
  @IsNotEmpty()
  @IsString()
  html: string;
  @IsOptional()
  @IsString()
  text: string;
}
