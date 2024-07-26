import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ContactUsDocument = HydratedDocument<ContactUs>;

export enum ContactUsSubject {
  GENERAL_INQUIRY = 'General Inquiry',
  SUPPORT = 'Support',
  FEEDBACK = 'Feedback',
  OTHER = 'Other',
}

@Schema({ timestamps: true })
export class ContactUs {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({
    required: true,
    enum: ContactUsSubject,
    type: String,
  })
  subject: ContactUsSubject;

  @Prop({ required: true })
  message: string;
}

export const ContactUsSchema = SchemaFactory.createForClass(ContactUs);
