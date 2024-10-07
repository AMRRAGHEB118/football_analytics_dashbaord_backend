import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Team } from './schema/team.schema';
import { Model } from 'mongoose';
import { DataImportService } from 'src/services/dataImport/data.import.service';
import { LoggerService } from 'src/services/logger/logger.service';
import { TeamStatistics } from './schema/teamStats.schema';



@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<Team>,
    @InjectModel(TeamStatistics.name) private statModel: Model<TeamStatistics>,
    private readonly dataImport: DataImportService,
    private readonly loggerService: LoggerService,
  ) { }

  async findOne(id: number, seasonId: number) {
    return await this.teamModel.findOne({ id })
      .populate({ path: 'statistics', match: { seasonId: seasonId } }).exec();
  }

  async reloadTeam(id: number) {
    return this.dataImport.importTeam(id)
  }

  async fetchAllTeams() {
    return await this.dataImport.fetchAllTeams();
  }

  async getTopScorerOfSeason(seasonId: number) {
    const teams = await this.statModel.aggregate(
      [
        {
          $match: {
            seasonId: seasonId,
          },
        },
        {
          $group: {
            _id: "$teamId",
            totalGoalsScored: {
              $avg: "$totalGoalsScored"
            },
          }
        },
        {
          $sort: {
            totalGoalsScored: -1,
          },
        },
      ]
    );

    return this.teamModel.populate(teams, { path: '_id' });
  }

  async getMostFailedToScore(seasonId: number) {
    const teams = await this.statModel.aggregate(
      [
        {
          $match: {
            seasonId: seasonId,
          },
        },
        {
          $group: {
            _id: "$teamId",
            failedToScore: {
              $avg: "$failedToScore"
            },
          }
        },
        {
          $sort: {
            failedToScore: -1,
          },
        },
      ]
    );

    return this.teamModel.populate(teams, { path: '_id' });
  }

  async getMostPossessed(seasonId: number) {
    const teams = await this.statModel.aggregate(
      [
        {
          $match: {
            seasonId: seasonId,
          },
        },
        {
          $group: {
            _id: "$teamId",
            avgPossession: {
              $avg: "$ballPossession"
            },
          }
        },
        {
          $sort: {
            avgPossession: -1,
          },
        },
      ]
    );
    return this.teamModel.populate(teams, { path: '_id' });
  }

  async getTopScorersOfPeriod(seasonId: number, period: number) {

    const periods = {
      1: "0-15",
      2: "15-30",
      3: "30-45",
      4: "45-60",
      5: "60-75",
      6: "75-90",
    };

    const teams = await this.statModel.aggregate(
      [
        {
          $match: {
            seasonId: seasonId,
          },
        },
        {
          $group: {
            _id: "$teamId",
            goalsScored: {
              $max: '$scoringTiming.'.concat(periods[period]).concat('.count')
            },
          }
        },
        {
          $sort: {
            goalsScored: -1,
          },
        },
      ]
    );
    return this.teamModel.populate(teams, { path: '_id' });
  }


  async getMostScoredAtOfPeriod(seasonId: number, period: number) {

    const periods = {
      1: "0-15",
      2: "15-30",
      3: "30-45",
      4: "45-60",
      5: "60-75",
      6: "75-90",
    };

    const teams = await this.statModel.aggregate(
      [
        {
          $match: {
            seasonId: seasonId,
          },
        },
        {
          $group: {
            _id: "$teamId",
            goalsConceded: {
              $max: '$goalsConcededTiming.'.concat(periods[period]).concat('.count')
            },
          }
        },
        {
          $sort: {
            goalsConceded: -1,
          },
        },
      ]
    );
    return this.teamModel.populate(teams, { path: '_id' });
  }
}
