import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './schema/team.schema';
import { HttpModule} from '@nestjs/axios';
import { TeamStatistics, TeamStatSchema } from './schema/teamStats.schema';
import { DataImportModule } from 'src/services/dataImport/data.import.module';
import { LoggerModule } from 'src/services/logger/logger.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }, {name: TeamStatistics.name, schema: TeamStatSchema}]),
  HttpModule,
  DataImportModule,
  LoggerModule],
  providers: [TeamService],
  controllers: [TeamController]
})
export class TeamModule {}
