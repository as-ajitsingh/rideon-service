import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Vendor {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, required: true })
  contactNumber: string;
}

export type VendorDocument = HydratedDocument<Vendor>;
export const VendorSchema = SchemaFactory.createForClass(Vendor);
