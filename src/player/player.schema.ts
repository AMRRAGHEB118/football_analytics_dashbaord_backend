import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PlayerDocument = HydratedDocument<Player>;

@Schema()
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

export const PlayerSchema = SchemaFactory.createForClass(Player);
