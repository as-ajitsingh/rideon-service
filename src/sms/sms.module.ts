import { Module } from '@nestjs/common';
import { SMSService } from './sms.service';

@Module({
  providers: [SMSService],
})
export class SMSModule {}
