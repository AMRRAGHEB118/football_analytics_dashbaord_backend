import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type StatisticsDocument = HydratedDocument<Statistics>;

@Schema({ timestamps: true })
export class Statistics {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Player', required: true })
  playerId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  sessionId: number;

  @Prop()
  totalGoals: number;

  @Prop()
  goals: number;

  @Prop()
  penalties: number;

  @Prop()
  assists: number;

  @Prop()
  yellowCardsAway: number;

  @Prop()
  yellowCardsHome: number;

  @Prop()
  yellowCards: number;

  @Prop()
  minutesPlayed: number;

  @Prop()
  appearances: number;

  @Prop()
  lineups: number;

  @Prop()
  goalsConceded: number;

  @Prop()
  cleanSheets: number;

  @Prop()
  cleanSheetsHome: number;

  @Prop()
  cleanSheetsAway: number;

  @Prop()
  ownGoals: number;
}

export const StatisticsSchema = SchemaFactory.createForClass(Statistics);
