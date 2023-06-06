import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
class Vendor {
  @Prop(String)
  name: string;

  contactNumber: string;
}

const VendorSchema = SchemaFactory.createForClass(Vendor);

@Schema()
class Driver {
  name: string;
  contactNumber: string;
}

const DriverSchema = SchemaFactory.createForClass(Driver);

@Schema()
class Cab {
  model: string;
  number: string;
}

const CabSchema = SchemaFactory.createForClass(Cab);

@Schema()
export class Route {
  @Prop(String)
  name: string;

  @Prop(String)
  description: string;

  @Prop({ type: VendorSchema, required: true })
  vendor: Vendor;

  //   @Prop({ type: DriverSchema, required: true })
  //   driver: { name: string; contactNumber: string };

  //   @Prop({ type: CabSchema, required: true })
  //   cab: { model: string; number: string };
}

export const RouteSchema = SchemaFactory.createForClass(Route);
