import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StatisticsDocument = HydratedDocument<Statistics>;

@Schema({ timestamps: true })
export class Statistics {
  @Prop({ required: true })
  sessionId: string;

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
