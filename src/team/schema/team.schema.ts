import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TeamStatistics } from './teamStats.schema';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Team {
  @Prop({ unique: true, required: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop()
  shortCode: string;

  @Prop()
  imgPath: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'TeamStatistics' }],
    default: [],
  })
  statistics: TeamStatistics[];
}

export type TeamDocument = HydratedDocument<Team>;
export const TeamSchema = SchemaFactory.createForClass(Team);
