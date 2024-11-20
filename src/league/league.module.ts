import { Module } from '@nestjs/common';
import { LeagueService } from './league.service';
import { LeagueController } from './league.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { League, LeagueSchema } from './schema/league.schema';
import { LoggerModule } from 'src/services/logger/logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: League.name, schema: LeagueSchema }]),
    LoggerModule
  ],
  controllers: [LeagueController],
  providers: [LeagueService],
})
export class LeagueModule {}
