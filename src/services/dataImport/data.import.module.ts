import { Module } from '@nestjs/common';
import { AxiosModule } from '../axios/axios.module';
import { DataImportService } from './data.import.service';
import { DataMapModule } from '../datamap/data-map.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [AxiosModule, DataMapModule, LoggerModule],
  providers: [DataImportService],
  exports: [DataImportService],
})
export class DataImportModule {}
