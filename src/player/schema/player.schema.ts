import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Statistics, StatisticsSchema } from './statistics.schema';

export type PlayerDocument = HydratedDocument<Player>;

@Schema({ timestamps: true })
export class Player {
  @Prop()
  id: number;

  @Prop()
  teamId: number;

  @Prop()
  country: number;

  @Prop()
  nationality: number;

  @Prop()
  position: number;

  @Prop()
  detailedPosition: number;

  @Prop()
  commonName: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  name: string;

  @Prop()
  displayName: string;

  @Prop()
  imagePath: string;

  @Prop()
  height: number;

  @Prop()
  weight: number;

  @Prop()
  dateOfBirth: string;

  @Prop({ type: [StatisticsSchema], default: [] })
  statistics: Statistics[];
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
