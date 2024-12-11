import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NewsDocument = HydratedDocument<News>;

@Schema({ timestamps: true })
export class News {
  @Prop()
  title: string;

  @Prop()
  img: string;

  @Prop({ index: { unique: true } })
  url: string;
}

export const NewsSchema = SchemaFactory.createForClass(News);
