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

  @Prop({
    type: [{
      id: { type: Number, required: true },
      seasonId: { type: Number, required: true }
    }],
  })
  statistics: [{
    id: number;
    seasonId: number;
  }]
}

export type TeamDocument = Team & Document;
export const TeamSchema = SchemaFactory.createForClass(Team);