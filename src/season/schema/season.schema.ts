import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Season {
  @Prop({unique: true, required: true})
  id: number;

  @Prop({required: true})
  name: string;

  @Prop({required: true})
  leagueId: number;

  @Prop({required: true})
  teamsIds: number[];
}

export type SeasonDocment = HydratedDocument<Season>;
export const SeasonSchema = SchemaFactory.createForClass(Season);
