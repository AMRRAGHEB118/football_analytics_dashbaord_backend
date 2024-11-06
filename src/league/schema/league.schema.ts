import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LeagueDocument = HydratedDocument<League>;

@Schema({ timestamps: true })
export class League {
  @Prop()
  id: number;

  @Prop()
  sportId: number;

  @Prop()
  countryId: number;

  @Prop()
  name: string;

  @Prop()
  active: boolean;

  @Prop()
  shortCode: string;

  @Prop()
  imagePath: string;

  @Prop()
  type: string;

  @Prop()
  subType: string;
}

export const LeagueSchema = SchemaFactory.createForClass(League);
