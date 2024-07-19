import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


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

  @Prop()
  founded: number;

  @Prop({ required: true })
  players: [{
    playerId: number;
  }];

  @Prop({ required: true })
  statistics: [{
    id: number;
    seasonId: number;
  }]
}

export const TeamSchema = SchemaFactory.createForClass(Team);