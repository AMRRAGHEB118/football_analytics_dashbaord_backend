import { Module } from '@nestjs/common';
import { AxiosModule } from '../axios/axios.module';
import { DataImportService } from './data.import.service';
import { DataMapModule } from '../datamap/data-map.module';

@Module({
  imports: [AxiosModule, DataMapModule],
  providers: [DataImportService],
  exports: [DataImportService],
})
export class DataImportModule {}
