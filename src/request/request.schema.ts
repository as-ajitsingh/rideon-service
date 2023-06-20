import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserDocument } from '../user/user.schema';
import mongoose, { HydratedDocument } from 'mongoose';

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
}

export type RequestDocument = HydratedDocument<Request>;
export const RequestSchema = SchemaFactory.createForClass(Request);
