// src/services/data-import.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AxiosService } from '../axios/axios.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DataImportService {
  constructor(
    private readonly axiosService: AxiosService,
    private readonly configService: ConfigService,
  ) {}

  async getPlayerData(playerId: number, session: string): Promise<any> {
    const apiToken = this.configService.get<string>('API_KEY');
    const baseUrl = this.configService.get<string>('FOOTBALL_API');
    const url = `${baseUrl}/players/${playerId}?api_token=${apiToken}&include=metadata;position;detailedPosition;statistics.details.type;&filters=playerStatisticSeasons:${session}`;

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
    const sessions = this.configService.get<string>('SESSIONS').split(',');
    for (const session of sessions) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const playerData = await this.getPlayerData(playerId, session);
      //TODO: Implement the logic to send data to your data map service
    }
    return Promise.resolve();
  }
}
