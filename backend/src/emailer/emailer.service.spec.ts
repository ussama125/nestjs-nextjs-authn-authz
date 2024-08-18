import { Test, TestingModule } from '@nestjs/testing';
import { EmailerService } from './emailer.service';
import {
  TestDbModule,
  closeInMongodConnection,
} from '../../test/test-db.module';
import { SendEmailDto } from './dto/send-email.dto';
import { ConfigService } from '@nestjs/config';
import { SES } from 'aws-sdk';
import { AttachmentEmailDto } from './dto/send-attachment-email.dto';
import { BadRequestException } from '@nestjs/common';

// Mock AWS SES
jest.mock('aws-sdk', () => {
  const mockSendEmail = jest.fn().mockReturnValue({ promise: jest.fn() });
  const mockSendRawEmail = jest.fn().mockReturnValue({ promise: jest.fn() });

  return {
    SES: jest.fn(() => ({
      sendEmail: mockSendEmail,
      sendRawEmail: mockSendRawEmail,
    })),
  };
});

describe('EmailerService', () => {
  let service: EmailerService;
  let configService: ConfigService;

  afterAll(async () => await closeInMongodConnection());

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDbModule],
      providers: [EmailerService, ConfigService],
    }).compile();

    service = module.get<EmailerService>(EmailerService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendEmail', () => {
    it('should send an email', async () => {
      const sendEmailDto = new SendEmailDto();
      sendEmailDto.subject = 'Test Email';
      sendEmailDto.html = '<p>Hello, this is a test email.</p>';
      sendEmailDto.text = 'Hello, this is a test email.';
      sendEmailDto.bcc = ['recipient@test.com'];

      await service.sendEmail(sendEmailDto);

      // Assert SES method calls
      expect(SES).toHaveBeenCalledWith({
        accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID_1'),
        secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY_1'),
        region: configService.get<string>('AWS_REGION_1'),
      });

      expect(new SES().sendEmail).toHaveBeenCalledWith({
        Source: 'no-reply@' + configService.get<string>('SITE_DOMAIN'),
        Destination: {
          BccAddresses: sendEmailDto.bcc,
        },
        Message: {
          Subject: { Data: sendEmailDto.subject },
          Body: {
            Html: { Data: sendEmailDto.html },
            Text: { Data: sendEmailDto.text },
          },
        },
        ReplyToAddresses: [],
      });
    });
  });

  describe('sendEmailWithAttachments', () => {
    it('should send an email with attachments', async () => {
      const attachmentDto = new AttachmentEmailDto();
      attachmentDto.from = 'test@test.com';
      attachmentDto.subject = 'Test Email';
      attachmentDto.message = '<p>Hello, this is a test email.</p>';
      attachmentDto.to = 'recipient@test.com';

      const files = [
        {
          originalname: 'file1.txt',
          buffer: Buffer.from('File 1 content'),
          size: 10,
        },
        {
          originalname: 'file2.txt',
          buffer: Buffer.from('File 2 content'),
          size: 15,
        },
      ];

      await service.sendEmailWithAttachments(attachmentDto, files);

      // Assert SES method calls
      expect(SES).toHaveBeenCalledWith({
        accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID_1'),
        secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY_1'),
        region: configService.get<string>('AWS_REGION_1'),
      });

      expect(new SES().sendRawEmail).toHaveBeenCalledWith({
        RawMessage: {
          Data: expect.any(String),
        },
      });
    });

    it('should throw BadRequestException for too many attachments', async () => {
      const files = [
        {
          originalname: 'file1.txt',
          buffer: Buffer.from('File 1 content'),
          size: 10,
        },
        {
          originalname: 'file2.txt',
          buffer: Buffer.from('File 2 content'),
          size: 15,
        },
        {
          originalname: 'file3.txt',
          buffer: Buffer.from('File 3 content'),
          size: 20,
        },
        {
          originalname: 'file4.txt',
          buffer: Buffer.from('File 3 content'),
          size: 20,
        },
      ];

      // Assert that the method throws BadRequestException
      await expect(
        service.sendEmailWithAttachments(new AttachmentEmailDto(), files),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should throw BadRequestException for oversized attachment', async () => {
      const files = [
        {
          originalname: 'oversized.txt',
          buffer: Buffer.from('Oversized content'),
          size: 3 * 1024 * 1024 + 1,
        },
      ];

      // Assert that the method throws BadRequestException
      await expect(
        service.sendEmailWithAttachments(new AttachmentEmailDto(), files),
      ).rejects.toThrowError(BadRequestException);
    });
  });
});
