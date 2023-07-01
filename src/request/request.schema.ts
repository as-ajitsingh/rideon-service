import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserDocument } from '../user/user.schema';
import mongoose, { HydratedDocument } from 'mongoose';
import { VendorDocument } from '../vendor/vendor.schema';

export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Schema()
export class Request {
  @Prop({ type: String, required: true })
  pickupLocation: string;

  @Prop({ type: String, required: true })
  dropLocation: string;

  @Prop({ type: Date, required: true })
  pickupTime: Date;

  @Prop({ type: String, required: true })
  projectCode: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  raisedBy: UserDocument;

  @Prop({ type: String, enum: RequestStatus })
  status: RequestStatus;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' })
  allotedVendor: VendorDocument;
}

export type RequestDocument = HydratedDocument<Request>;
export const RequestSchema = SchemaFactory.createForClass(Request);
