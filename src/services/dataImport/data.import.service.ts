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


@Injectable()
export class DataImportService {
  constructor(
    private readonly axiosService: AxiosService,
    private readonly configService: ConfigService,
    private readonly dataMapService: DataMapService,
    private readonly logger: LoggerService,
    @InjectModel(Team.name) private teamModel: Model<Team>
  ) {
  }


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
          '/team:id', 'GET', 404, LoggerModule.PLAYER
        );
        return {
          "err": "",
          "status_code": 404,
          "data": null
        };
      };
      return {
        "err": "",
        "status_code": 200,
        "data": response.data
      };
    } catch (error) {
      return {
        "err": error,
        "status_code": 500,
        "data": null
      };
    }
  }

  async getPlayersData(): Promise<_Response> {
    const apiToken = this.configService.get<string>('API_KEY');
    const seasons = this.configService.get<string>('SEASONS').split(',');
    try {
      const teams = await this.teamModel.find();
      const result: Player[] = await Promise.all(teams.map(async team => {
        const url = `squads/teams/${team.id}?api_token=${apiToken}` +
        `&per_page=50&include=player.statistics.details.type` +
        `;detailedPosition;position` +
        `&filters=playerstatisticSeasons:${seasons}`;
        const response = (await this.axiosService.instance.get(url)).data;

        await Promise.all(response.data.map(async player => {
          player.player.detailedPosition = player.detailedPosition;
          player.player.position = player.position;
          player.player.team_id = team.id;
          const res = await this.dataMapService.mapAndSavePlayerData(player.player);
          return res;
        }))
        return response.data
      }));
      if (result.length === 0) {
        return {
          err: 'No players found',
          status_code: 404,
          data: []
        };
      }
      return {
        err: null,
        status_code: 200,
        data: result
      };
    } catch (error) {
      return {
        err: error,
        status_code: 500,
        data: null,
      }
    }
  }

  async importPlayerData(playerId: number): Promise<_Response> {
    const seasons = this.configService.get<string>('SEASONS').split(',');
    for (const season of seasons) {
      try {
        const playerData = await this.getPlayerData(playerId, season);
        const result = await this.dataMapService.mapAndSavePlayerData(playerData.data);
        return {
          "err": "",
          "status_code": 200,
          "data": result,
        }
      } catch (error) {
        return {
          "err": error,
          "status_code": 500,
          "data": null,
        }
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
          "err": "",
          "status_code": 404,
          "data": null
        };
      };
      const savedTeam = await this.dataMapService.mapAndSaveTeamData(team.data);
      return {
        "err": "",
        "status_code": 200,
        "data": savedTeam
      };
    } catch (error) {
      return {
        "err": error,
        "status_code": 500,
        "data": null
      }
    }
  }

  async fetchAllTeams(): Promise<_Response> {
    const apiToken = this.configService.get<string>('API_KEY');
    const seasons = this.configService.get<string>('SEASONS');
    const url =
      `/teams/countries/1161?api_token=${apiToken}&per_page=50` +
      `&include=statistics.details.type&filters=teamstatisticSeasons:${seasons}`;

    try {
      const teams = await this.axiosService.instance.get(url);
      const mappedTeams =
        await Promise.all
          (
            teams.data.data.map(async (team: object) => {
              const mapped_team = await this.dataMapService.mapAndSaveTeamData(team);
              return mapped_team || null
            })
          ).then(results => results.filter(team => team !== null));

      return {
        "err": "",
        "status_code": 200,
        "data": mappedTeams,
      }
    } catch (error) {
      return {
        "err": error,
        "status_code": 500,
        "data": null
      }
    }
  }

  async fetchSeasons(): Promise<_Response> {
    const SEASONS = ["2020/2021", "2021/2022", "2022/2023", "2023/2024"];
    const LEAGUE_ID = "501";
    const API_TOKEN = this.configService.get<string>('API_KEY');
    const URL =
      `https://api.sportmonks.com/v3/football/seasons?api_token=` +
      `${API_TOKEN}&&include=league;teams&filters=seasonLeagues:${LEAGUE_ID}`;

    try {
      const seasons = ((await this.axiosService.instance.get(URL)).data.data)
        .filter((season) => SEASONS.includes(season.name));

      const mappedSeasons = await Promise.all
        (
          seasons.map(async (season: any) => {
            try {
              return await this.dataMapService.mapOnSeasons(season);
            } catch (error) {
              this.logger.logError
                (
                  `Error while mapping on season ${season}`,
                  '/season', 'GET', 500, LoggerModule.SEASON, error
                );
            }
          })
        );
      return {
        "err": "",
        "status_code": 200,
        "data": mappedSeasons
      };
    } catch (error) {
      return {
        "err": error,
        "status_code": 500,
        "data": null
      };
    }
  }
}
