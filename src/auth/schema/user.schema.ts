import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  account: string;

  @Prop({ required: true })
  password: string;
}

export type UserDocment = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
