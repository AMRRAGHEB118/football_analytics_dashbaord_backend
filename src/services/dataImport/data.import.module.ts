import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AxiosModule } from '../axios/axios.module';
import { DataImportService } from './data.import.service';
import { DataMapModule } from '../datamap/data-map.module';

@Module({
  imports: [ConfigModule, AxiosModule, DataMapModule],
  providers: [DataImportService],
  exports: [DataImportService],
})
export class DataImportModule {}
