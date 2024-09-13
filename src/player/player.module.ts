import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Player, PlayerSchema } from './schema/player.schema';
import { Statistics, StatisticsSchema } from './schema/statistics.schema';
import { DataImportModule } from 'src/services/dataImport/data.import.module';
import { PlayerController } from './player.controller';
import { LoggerModule } from 'src/services/logger/logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Player.name, schema: PlayerSchema },
      { name: Statistics.name, schema: StatisticsSchema },
    ]),
    DataImportModule,
    LoggerModule
  ],
  controllers: [PlayerController],
  providers: [PlayerService],
  exports: [
    MongooseModule.forFeature([
      { name: Player.name, schema: PlayerSchema },
      { name: Statistics.name, schema: StatisticsSchema },
    ]),
  ],
})
export class PlayerModule {}
