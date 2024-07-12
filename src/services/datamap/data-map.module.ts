import { Module } from '@nestjs/common';
import { DataMapService } from './data-map.service';

@Module({
  imports: [],
  providers: [DataMapService],
  exports: [DataMapService],
})
export class DataMapModule {}
