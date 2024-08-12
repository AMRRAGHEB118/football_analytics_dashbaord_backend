import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AxiosService } from '../axios/axios.service';
import { ConfigService } from '@nestjs/config';
import { DataMapService } from '../datamap/data-map.service';
import { Team } from 'src/team/schema/team.schema';


@Injectable()
export class DataImportService {
  constructor(
    private readonly axiosService: AxiosService,
    private readonly configService: ConfigService,
    private readonly dataMapService: DataMapService,
  ) { }

  async getPlayerData(playerId: number, season: string): Promise<any> {
    const apiToken = this.configService.get<string>('API_KEY');
    const url = `/players/${playerId}?api_token=${apiToken}&include=metadata;position;detailedPosition;statistics.details.type;&filters=playerStatisticSeasons:${season}`;

    try {
      const response = await this.axiosService.instance.get(url);
      return response.data;
    } catch (error) {
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

  async importTeam(teamId: number): Promise<any> {
    const apiToken = this.configService.get<string>('API_KEY');
    const seasons = this.configService.get<string>('SEASONS');
    const url = `/teams/${teamId}?api_token=${apiToken}&include=statistics.details.type&filters=teamstatisticSeasons:${seasons}`;
    try {
      const team = await this.axiosService.instance.get(url);
      if (!team.data?.data?.id) throw new HttpException('Team Not Found', HttpStatus.NOT_FOUND);
      const savedTeam = await this.dataMapService.mapAndSaveTeamData(team.data);
      return savedTeam;
    } catch (error) {
      console.error(error);
    }
  }

  async fetchAllTeams(): Promise<Team[]> {
    const apiToken = this.configService.get<string>('API_KEY');
    const seasons = this.configService.get<string>('SEASONS');
    const url = `/teams/countries/1161?api_token=${apiToken}&per_page=50&include=statistics.details.type&filters=teamstatisticSeasons:${seasons}`;
    try {
      const teams = await this.axiosService.instance.get(url);
      const mappedTeams = await Promise.all(teams.data.data.map(async (team: object) => {
        return this.dataMapService.mapAndSaveTeamData(team);
      }));
      return mappedTeams;
    } catch (error) {
    }
  }
}
