// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as nodemailer from 'nodemailer';

// @Injectable()
// export class MailerService {
//   private readonly transporter: nodemailer.Transporter;

//   constructor(private readonly configService: ConfigService<any>) {
//     this.transporter = nodemailer.createTransport({
//       host: this.configService.get('MAIL_HOST'),
//       port: this.configService.get('MAIL_PORT'),
//       auth: {
//         user: this.configService.get('MAIL_USER'),
//         pass: this.configService.get('MAIL_PASSWORD'),
//       },
//     });
//   }

//   async sendEmail(mailOptions): Promise<void> {
//     return this.transporter.sendMail(mailOptions);
//   }

//   sendRegistrationEmail = async (to: string, name: string, otp: string) => {
//     const mailOptions: nodemailer.SendMailOptions = {
//       from: this.configService.get('MAIL_USER'),
//       to,
//       subject: ' Account Verification and Password Setup',
//       text: `
//       Dear  ${name}
//       We are delighted to inform you that an administrator has added you to our system. As a new user, we kindly request you to complete the account verification process and set up your password.
//       Your OTP:  ${otp}
//       Visit our  ${this.configService.get(
//         'SYSTEM_NAME',
//       )} verification portal: ${this.configService.get('SITE_LINK')}
//       `,
//     };
//     return this.sendEmail(mailOptions);
//   };

//   sendPasswordResetEmail = async (
//     to: string,
//     name: string,
//     resetToken: string,
//   ) => {
//     const resetUrl = `${this.configService.get(
//       'SITE_LINK',
//     )}/reset-password?token=${resetToken}`;

//     const mailOptions: nodemailer.SendMailOptions = {
//       from: this.configService.get('MAIL_USER'),
//       to,
//       subject: 'Password Reset',
//       text: `
//         Dear ${name},
//         You have requested to reset your password. Please click the link below to proceed with resetting your password:
//         ${resetUrl}
//         Thank you.
//       `,
//     };
//     await this.sendEmail(mailOptions);
//   };
// }
