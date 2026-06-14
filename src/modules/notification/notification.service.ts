import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  //  private transporter;

  // constructor() {
  //   this.transporter = nodemailer.createTransport({
  //     host: process.env.SMTP_HOST,
  //     port: Number(process.env.SMTP_PORT),
  //     auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  //   });
  // }

  sendVerificationEmail(to: string, token: string) {
    // async sendVerificationEmail(to: string, token: string) {
    // const url = `${process.env.APP_URL}/verify?token=${token}`;
    // await this.transporter.sendMail({
    //   to,
    //   subject: 'Verify your email',
    //   html: `<a href="${url}">Click to verify</a>`,
    // });
    console.log(`Verification email sent to ${to} with token: ${token}`);
    return { message: 'Verification email sent(to the console)' };
  }

  // findAll() {
  //   return `This action returns all notification`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} notification`;
  // }

  // update(id: number, updateNotificationDto: UpdateNotificationDto) {
  //   return `This action updates a #${id} notification`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} notification`;
  // }
}
