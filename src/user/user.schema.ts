import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class User {
  @Prop({ type: String, unique: true })
  authId: string;

  @Prop({ type: [String] })
  roles: string[];

  @Prop(String)
  name: string;

  @Prop(String)
  email: string;

  @Prop(String)
  picture: string;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
