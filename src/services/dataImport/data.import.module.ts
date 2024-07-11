// src/services/services.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AxiosModule } from '../axios/axios.module';
import { DataImportService } from './data.import.service';

@Module({
  imports: [ConfigModule, AxiosModule],
  providers: [DataImportService],
  exports: [DataImportService],
})
export class ServicesModule {}
