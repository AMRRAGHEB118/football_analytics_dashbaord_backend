import { Injectable } from '@nestjs/common';
import { DataImportService } from 'src/services/dataImport/data.import.service';

@Injectable()
export class SeasonService {
  constructor(private readonly dataImport: DataImportService) { }

  async fetchSeasons(): Promise<any> {
    return this.dataImport.fetchSeasons();
  }
}
