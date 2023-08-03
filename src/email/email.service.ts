import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService, private configService: ConfigService) {}

  async sendMail(to: string | string[], subject: string, html: string) {
    await this.mailerService.sendMail({
      to,
      subject,
      html,
      from: {
        name: this.configService.get('EMAIL_FROM_NAME'),
        address: this.configService.get('EMAIL_FROM_ADDRESS'),
      },
    });
  }
}
