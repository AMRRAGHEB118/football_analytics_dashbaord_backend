import { Injectable } from '@nestjs/common';
import { AxiosService } from '../axios/axios.service';
import { ConfigService } from '@nestjs/config';
import { DataMapService } from '../datamap/data-map.service';
import { LoggerService } from '../logger/logger.service';
import { LoggerModule } from '../logger/logger.schema';
import { Team } from 'src/team/schema/team.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Player } from 'src/player/schema/player.schema';
import _Response from '../../types';
import { Season, SeasonDocment } from 'src/season/schema/season.schema';

@Injectable()
export class DataImportService {
  constructor(
    private readonly axiosService: AxiosService,
    private readonly configService: ConfigService,
    private readonly dataMapService: DataMapService,
    private readonly logger: LoggerService,
    @InjectModel(Team.name) private teamModel: Model<Team>,
    @InjectModel(Season.name) private seasonModel: Model<SeasonDocment>,
  ) {}

  async getPlayerData(playerId: number, season: string): Promise<_Response> {
    const apiToken = this.configService.get<string>('API_KEY');
    const url =
      `/players/${playerId}?api_token=${apiToken}` +
      `&include=metadata;position;detailedPosition;` +
      `statistics.details.type;&filters=playerStatisticSeasons:${season}`;

    try {
      const response = await this.axiosService.instance.get(url);
      if (!response?.data) {
        this.logger.logError(
          `Player ${playerId} data for season ${season} Not Found!`,
          '/team:id',
          'GET',
          404,
          LoggerModule.PLAYER,
        );
        return {
          err: '',
          status_code: 404,
          data: null,
        };
      }
      return {
        err: '',
        status_code: 200,
        data: response.data,
      };
    } catch (error) {
      return {
        err: error,
        status_code: 500,
        data: null,
      };
    }
  }

  async getPlayersData(): Promise<_Response> {
    const apiToken = this.configService.get<string>('API_KEY');
    // const seasons = this.configService.get<string>('SEASONS').split(',');
    const seasons = (await this.seasonModel.find()).map((s: Season) => s.id);
    try {
      const teams = await this.teamModel.find();
      const result: Player[] = await Promise.all(
        teams.map(async (team) => {
          const url =
            `squads/teams/${team.id}?api_token=${apiToken}` +
            `&per_page=50&include=player.statistics.details.type` +
            `;detailedPosition;position` +
            `&filters=playerstatisticSeasons:${seasons}`;
          const response = (await this.axiosService.instance.get(url)).data;

          await Promise.all(
            response.data.map(async (player) => {
              player.player.detailedPosition = player.detailedPosition;
              player.player.position = player.position;
              player.player.team_id = team.id;
              const res = await this.dataMapService.mapAndSavePlayerData(
                player.player,
              );
              return res;
            }),
          );
          return response.data;
        }),
      );
      if (result.length === 0) {
        return {
          err: 'No players found',
          status_code: 404,
          data: [],
        };
      }
      return {
        err: null,
        status_code: 200,
        data: result,
      };
    } catch (error) {
      return {
        err: error,
        status_code: 500,
        data: null,
      };
    }
  }

  async importPlayerData(playerId: number): Promise<_Response> {
    const seasons = this.configService.get<string>('SEASONS').split(',');
    for (const season of seasons) {
      try {
        const playerData = await this.getPlayerData(playerId, season);
        const result = await this.dataMapService.mapAndSavePlayerData(
          playerData.data,
        );
        return {
          err: '',
          status_code: 200,
          data: result,
        };
      } catch (error) {
        return {
          err: error,
          status_code: 500,
          data: null,
        };
      }
    }
  }

  async importTeam(teamId: number): Promise<_Response> {
    const apiToken = this.configService.get<string>('API_KEY');
    const seasons = this.configService.get<string>('SEASONS');
    const url =
      `/teams/${teamId}?api_token=${apiToken}&include=statistics.details.type` +
      `&filters=teamstatisticSeasons:${seasons}`;

    try {
      const team = await this.axiosService.instance.get(url);
      if (!team.data?.data?.id) {
        return {
          err: '',
          status_code: 404,
          data: null,
        };
      }
      const savedTeam = await this.dataMapService.mapAndSaveTeamData(team.data);
      return {
        err: '',
        status_code: 200,
        data: savedTeam,
      };
    } catch (error) {
      return {
        err: error,
        status_code: 500,
        data: null,
      };
    }
  }

  async fetchAllTeams(season: number, leagueId: number): Promise<_Response> {
    const apiToken = this.configService.get<string>('API_KEY');
    const url =
      `/teams/seasons/${season}?api_token=${apiToken}&per_page=50` +
      `&include=statistics.details.type&filters=teamstatisticSeasons:${season}`;

    try {
      const teams = await this.axiosService.instance.get(url);
      const mappedTeams = await Promise.all(
        teams.data.data.map(async (team: any) => {
          team.league_id = leagueId;
          const mapped_team =
            await this.dataMapService.mapAndSaveTeamData(team);
          return mapped_team || null;
        }),
      ).then((results) => results.filter((team) => team !== null));

      return {
        err: '',
        status_code: 200,
        data: mappedTeams,
      };
    } catch (error) {
      return {
        err: error,
        status_code: 500,
        data: null,
      };
    }
  }

  async fetchSeason(id: number): Promise<_Response> {
    const FOOTBALL_API = this.configService.get<string>('FOOTBALL_API');
    const API_TOKEN = this.configService.get<string>('API_KEY');
    const URL =
      `${FOOTBALL_API}/seasons/${id}?api_token=` +
      `${API_TOKEN}&&include=league;teams`;
    try {
      const season = (await this.axiosService.instance.get(URL)).data.data;
      const mappedSeason = await this.dataMapService.mapOnSeasons(season);
      await this.dataMapService.mapOnLeague(season.league);
      await this.fetchAllTeams(season.id, season.league.id);
      await this.getPlayersData();
      return {
        err: '',
        status_code: 200,
        data: [mappedSeason],
      };
    } catch (error) {
      return {
        err: error,
        status_code: 500,
        data: null,
      };
    }
  }
}
