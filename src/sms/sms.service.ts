import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';
import { getFormattedContactNumber } from './sms.utils';

@Injectable()
export class SMSService {
  constructor(private configService: ConfigService) {}

  async sendMessage(contactNumber: string, text: string) {
    const headers = {
      Authorization: `Basic ${Buffer.from(
        `${this.configService.get('TWILIO_ACCOUNT_SID')}:${this.configService.get('TWILIO_AUTH_TOKEN')}`,
      ).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const body = new URLSearchParams({
      To: getFormattedContactNumber(contactNumber),
      From: this.configService.get('TWILIO_NUMBER'),
      Body: text,
    });
    try {
      const response = await fetch(
        `${this.configService.get('TWILIO_URL')}/${this.configService.get('TWILIO_ACCOUNT_SID')}/Messages.json`,
        {
          method: 'POST',
          headers: headers,
          body: body,
        },
      );
      const result = await response.json();
      console.log(`message ${result.sid} is ${result.status}`);
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  }
}
