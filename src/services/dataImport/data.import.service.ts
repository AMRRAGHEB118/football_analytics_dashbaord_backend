import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AxiosService } from '../axios/axios.service';
import { ConfigService } from '@nestjs/config';
import { DataMapService } from '../datamap/data-map.service';

@Injectable()
export class DataImportService {
  constructor(
    private readonly axiosService: AxiosService,
    private readonly configService: ConfigService,
    private readonly dataMapService: DataMapService,
  ) {}

  async getPlayerData(playerId: number, season: string): Promise<any> {
    const apiToken = this.configService.get<string>('API_KEY');
    const url = `/players/${playerId}?api_token=${apiToken}&include=metadata;position;detailedPosition;statistics.details.type;&filters=playerStatisticSeasons:${season}`;

    try {
      const response = await this.axiosService.instance.get(url);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to fetch player data',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async importPlayerData(playerId: number): Promise<void> {
    const seasons = this.configService.get<string>('SEASONS').split(',');
    for (const season of seasons) {
      try {
        const playerData = await this.getPlayerData(playerId, season);
        await this.dataMapService.mapAndSavePlayerData(playerData);
      } catch (error) {
        console.error(
          `Failed to import data for player ${playerId} in season ${season}`,
          error,
        );
      }
    }
    return Promise.resolve();
  }
}
