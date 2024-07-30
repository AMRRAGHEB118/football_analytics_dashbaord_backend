import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';


@Schema()
export class TeamStatistics {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Team', required: true })
  teamId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  seasonId: number;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    default: {
      "0-15": {
        "count": 0,
        "percentage": 0,
      },
      "15-30": {
        "count": 0,
        "percentage": 0
      },
      "30-45": {
        "count": 0,
        "percentage": 0
      },
      "45-60": {
        "count": 0,
        "percentage": 0
      },
      "60-75": {
        "count": 0,
        "percentage": 0
      },
      "75-90": {
        "count": 0,
        "percentage": 0
      },
    },
  })
  scoringTiming: {
    "0-15": MongooseSchema.Types.Mixed,
    "15-30": MongooseSchema.Types.Mixed,
    "30-45": MongooseSchema.Types.Mixed,
    "45-60": MongooseSchema.Types.Mixed,
    "60-75": MongooseSchema.Types.Mixed,
    "75-90": MongooseSchema.Types.Mixed,
  };

  @Prop({
    type: MongooseSchema.Types.Mixed,
    default: {
      "0-15": {
        "count": 0,
        "percentage": 0,
      },
      "15-30": {
        "count": 0,
        "percentage": 0,
      },
      "30-45": {
        "count": 0,
        "percentage": 0,
      },
      "45-60": {
        "count": 0,
        "percentage": 0,
      },
      "60-75": {
        "count": 0,
        "percentage": 0,
      },
      "75-90": {
        "count": 0,
        "percentage": 0,
      },
    },
  })
  goalsConcededTiming: {
    "0-15": MongooseSchema.Types.Mixed,
    "15-30": MongooseSchema.Types.Mixed,
    "30-45": MongooseSchema.Types.Mixed,
    "45-60": MongooseSchema.Types.Mixed,
    "60-75": MongooseSchema.Types.Mixed,
    "75-90": MongooseSchema.Types.Mixed,
  };

  @Prop()
  goalsScoredHome: number;
  
  @Prop()
  goalsScoredAway: number;
  
  @Prop()
  totalGoalsScored: number;
  
  @Prop()
  goalsConcededHome: number;
  
  @Prop()
  goalsConcededAway: number;

  @Prop()
  totalGoalsConceded: number;

  @Prop()
  yellowCards: number;

  @Prop()
  redCards: number;

  @Prop()
  ballPossession: number;

  @Prop()
  lostHome: number;

  @Prop()
  lostAway: number;

  @Prop()
  drawHome: number;

  @Prop()
  drawAway: number;
  
  @Prop()
  winHome: number;
  
  @Prop()
  winAway: number;

  @Prop()
  corners: number;

  @Prop()
  cleanSheets: number;

  @Prop()
  failedToScore: number
}

export type TeamStatDocument = HydratedDocument<TeamStatistics>;
export const TeamStatSchema = SchemaFactory.createForClass(TeamStatistics);
