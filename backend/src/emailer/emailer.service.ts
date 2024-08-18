import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { SES } from 'aws-sdk';

@Injectable()
export class EmailerService {
  // private ses: SES;
  private readonly logger = new Logger(EmailerService.name);

  constructor(private configService: ConfigService) {
    // this.ses = new SES({
    //   accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID_1'),
    //   secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY_1'),
    //   region: configService.get<string>('AWS_REGION_1'),
    // });
  }

  // async sendEmail(emailData: SendEmailDto) {
  //   const params: any = {
  //     Source:
  //       emailData.sender ||
  //       'no-reply@' + this.configService.get<string>('SITE_DOMAIN'),
  //     Destination: {
  //       BccAddresses: emailData.bcc,
  //       // CcAddresses: emailData.cc || [],
  //       // ToAddresses: emailData.to || [],
  //     },
  //     Message: {
  //       Subject: { Data: emailData.subject },
  //       Body: {
  //         Html: { Data: emailData.html },
  //       },
  //     },
  //     ReplyToAddresses: [],
  //   };

  //   if (emailData.text) {
  //     params.Message.Body.Text = { Data: emailData.text };
  //   }

  //   return this.ses.sendEmail(params).promise();
  // }

  // async sendEmailWithAttachments(emailData: AttachmentEmailDto, files) {
  //   if (files && files.length > 3) {
  //     throw new BadRequestException(
  //       'Exceeded the maximum number of allowed files (3).',
  //     );
  //   }

  //   for (const file of files) {
  //     // Ensure the file is not too large (2MB limit)
  //     if (file.size > 2 * 1024 * 1024) {
  //       throw new BadRequestException(
  //         `File ${file.originalname} exceeds the size limit.`,
  //       );
  //     }
  //   }

  //   const sesAttachments = files.map((attachment) => ({
  //     Filename: attachment.originalname,
  //     Content: attachment.buffer.toString('base64'),
  //   }));

  //   // Construct raw email with attachments
  //   const rawEmail = this.constructRawEmail(emailData, sesAttachments);

  //   // Send the raw email
  //   const result = await this.ses
  //     .sendRawEmail({ RawMessage: { Data: rawEmail } })
  //     .promise();

  //   return result;
  // }

  // private constructRawEmail(
  //   emailData: AttachmentEmailDto,
  //   files: any[],
  // ): string {
  //   const boundary = 'NextPart';

  //   // Construct raw email with attachments
  //   let rawEmail = `From: ${emailData.from}\n`;
  //   rawEmail += `To: ${emailData.to}\n`;
  //   rawEmail += `Subject: ${emailData.subject}\n`;
  //   rawEmail += `MIME-Version: 1.0\n`;
  //   rawEmail += `Content-type: multipart/mixed; boundary=${boundary}\n\n`;
  //   rawEmail += `--${boundary}\n`;
  //   rawEmail += `Content-type: text/html; charset="UTF-8"\n`;
  //   rawEmail += `Content-transfer-encoding: quoted-printable\n`;
  //   rawEmail += `Content-Disposition: inline\n\n`;
  //   rawEmail += `${emailData.message}\n\n`;
  //   rawEmail += `--${boundary}`;

  //   // Add attachments to raw email
  //   files.forEach((file) => {
  //     rawEmail += `\nContent-type: application/octet-stream\n`;
  //     rawEmail += `Content-transfer-encoding: base64\n`;
  //     rawEmail += `Content-disposition: attachment; filename="${file.Filename}"\n\n`;
  //     rawEmail += `${file.Content}\n`;
  //     rawEmail += `--${boundary}`;
  //   });

  //   // End the raw email
  //   rawEmail += '--';

  //   this.logger.log(rawEmail);
  //   return rawEmail;
  // }

  getStandardEmail(body: string, heading: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>.button,a{text-decoration:none}a,p,table,td{font-family:Arial,sans-serif;font-size:16px;line-height:1.6;color:#333;margin:0;padding:0}table{border-collapse:collapse;width:100%}table td{border:1px solid #ddd;padding:10px}a{color:#007bff}.button{display:inline-block;background-color:#e32c2d;color:#fff;padding:10px 20px;border-radius:5px}@media only screen and (max-width:600px){table{width:100%!important}}@media only screen and (min-width:768px){.content-container{width:75%;margin:150px auto 0}}</style>
      </head>
      <body>
        <table class="content-container">
            <tr>
                <td colspan="2" style="background-color: #f0f0f0; text-align: center; padding: 20px;">
                    <img src="https://${this.configService.get<string>(
                      'S3_BUCKET_NAME_1',
                    )}.s3.amazonaws.com/logo.png"
                    alt="Logo" style="max-width: 200px;">
                    <h2>${heading}</h2>
                </td>
            </tr>
            ${body}
            <tr>
                <td colspan="2" style="background-color: #f0f0f0; text-align: center; padding:20px 0px; display: flex; justify-content: space-between; align-items: center;">
                    <div style="flex: 1; text-align:left; padding-left:25px ">
                        <p>Tel: <strong>1-866-289-6922</strong></p>
                    </div>
                    <div style="flex: 1;">
                        <a href="http://localhost:3000/">Visit our website</a>
                    </div>
                    <div style="flex: 1; text-align:right; padding-right:25px">
                        <a href="mailto:info@${this.configService.get<string>(
                          'SITE_DOMAIN',
                        )}">Email us</a>
                    </div>
                </td>
            </tr>
        </table>
      </body>
    </html>
    `;
  }
}
