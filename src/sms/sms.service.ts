import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';
import { getFormattedContactNumber } from './sms.utils';

@Injectable()
export class SMSService {
  twilioClient: twilio.Twilio;
  constructor(private configService: ConfigService) {
    this.twilioClient = twilio(configService.get('TWILIO_ACCOUNT_SID'), configService.get('TWILIO_AUTH_TOKEN'));
  }

  sendMessage(contactNumber: string, text: string) {
    this.twilioClient.messages
      .create({
        to: getFormattedContactNumber(contactNumber),
        body: text,
        from: this.configService.get('TWILIO_NUMBER'),
      })
      .then((message) => console.log(`message ${message.sid} is ${message.status}`))
      .catch((e) => console.error(e.message));
  }
}
