import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Request, RequestSchema } from './request.schema';
import { VendorService } from '../vendor/vendor.service';
import { Vendor, VendorSchema } from '../vendor/vendor.schema';
import { SMSService } from '../sms/sms.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Request.name, schema: RequestSchema }]),
    MongooseModule.forFeature([{ name: Vendor.name, schema: VendorSchema }]),
  ],
  controllers: [RequestController],
  providers: [RequestService, VendorService, SMSService],
})
export class RequestModule {}
