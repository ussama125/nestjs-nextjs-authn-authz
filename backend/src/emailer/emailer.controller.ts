import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EmailerService } from './emailer.service';
import { SendEmailDto } from './dto/send-email.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AttachmentEmailDto } from './dto/send-attachment-email.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('email')
@UseGuards(JwtAuthGuard)
export class EmailerController {
  constructor(private readonly emailer: EmailerService) {}

  @Post('send')
  async sendEmail(@Body() body: SendEmailDto) {
    // return this.emailer.sendEmail(body);
  }

  @Post('send-with-attachments')
  @UseInterceptors(AnyFilesInterceptor())
  async sendEmailWithAttachments(
    @UploadedFiles() attachments,
    @Body() emailDto: AttachmentEmailDto,
  ): Promise<any> {
    // return this.emailer.sendEmailWithAttachments(emailDto, attachments);
  }
}
