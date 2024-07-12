import { Module } from '@nestjs/common';
import { DataMapService } from './data-map.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Player, PlayerSchema } from '../../player/schema/player.schema';
import {
  Statistics,
  StatisticsSchema,
} from '../../player/schema/statistics.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Player.name, schema: PlayerSchema },
      { name: Statistics.name, schema: StatisticsSchema },
    ]),
  ],
  providers: [DataMapService],
  exports: [DataMapService],
})
export class DataMapModule {}
