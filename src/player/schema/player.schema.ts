import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Statistics } from './statistics.schema';

export type PlayerDocument = HydratedDocument<Player>;

@Schema({ timestamps: true })
export class Player {
  @Prop()
  id: number;

  @Prop()
  teamId: number;

  @Prop()
  position: string;

  @Prop()
  detailedPosition: string;

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

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Statistics' }],
    default: [],
  })
  statistics: Statistics[];
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
