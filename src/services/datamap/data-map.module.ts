import { Module } from '@nestjs/common';
import { DataMapService } from './data-map.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Player, PlayerSchema } from '../../player/schema/player.schema';
import {
  Statistics,
  StatisticsSchema,
} from '../../player/schema/statistics.schema';
import { Team, TeamSchema } from 'src/team/schema/team.schema';
import { TeamStatistics, TeamStatSchema } from 'src/team/schema/teamStats.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Player.name, schema: PlayerSchema },
      { name: Statistics.name, schema: StatisticsSchema },
      { name: Team.name, schema: TeamSchema},
      { name: TeamStatistics.name, schema: TeamStatSchema}
    ]),
  ],
  providers: [DataMapService],
  exports: [DataMapService],
})
export class DataMapModule {}
