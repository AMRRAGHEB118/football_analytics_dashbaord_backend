import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Player, PlayerSchema } from './schema/player.schema';
import { StatisticsSchema } from './schema/statistics.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Player.name, schema: PlayerSchema },
      { name: 'Statistics', schema: StatisticsSchema },
    ]),
  ],
  providers: [PlayerService],
})
export class PlayerModule {}
