import { Module } from '@nestjs/common';
import { AxiosModule } from '../axios/axios.module';
import { DataImportService } from './data.import.service';
import { DataMapModule } from '../datamap/data-map.module';
import { LoggerModule } from '../logger/logger.module';
import { Team, TeamSchema } from 'src/team/schema/team.schema';
import { MongooseModule } from '@nestjs/mongoose'; 
import { Season, SeasonSchema } from 'src/season/schema/season.schema';


@Module({
  imports: [AxiosModule,
    DataMapModule,
    LoggerModule,
    MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
    MongooseModule.forFeature([{ name: Season.name, schema: SeasonSchema }])
  ],
  providers: [DataImportService],
  exports: [DataImportService],
})
export class DataImportModule {}
