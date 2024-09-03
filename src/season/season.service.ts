import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DataImportService } from 'src/services/dataImport/data.import.service';

@Injectable()
export class SeasonService {
  constructor(private readonly dataImport: DataImportService) {}

  async getSeasons(): Promise<object> {
    try {
      const seasons = await this.dataImport.fetchSeasons();

      return {
        message: 'Seasons fetched successfully',
        status: HttpStatus.OK,
        data: [seasons],
      };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to fetch seasons',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
