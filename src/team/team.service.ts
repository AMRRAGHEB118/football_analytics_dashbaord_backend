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
          $project: {
            teamId: 1,
            totalGoalsScored: 1,
            seasonId: 1
          }
        },
        {
          $sort: {
            totalGoalsScored: -1,
          },
        },
        {
          $lookup: {
            from: "teams",
            localField: "teamId",
            foreignField: "_id",
            as: "team"
          }
        },
        {
          $unwind: {
            path: "$team",
            }
        },
      ]
    );

    return teams;
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
          $project: {
            teamId: 1,
            failedToScore: 1,
            seasonId: 1
          }
        },
        {
          $sort: {
            failedToScore: -1,
          },
        },
        {
          $lookup: {
            from: "teams",
            localField: "teamId",
            foreignField: "_id",
            as: "team"
          }
        },
        {
          $unwind: {
            path: "$team",
          }
        },
        {
          $limit: 5
        }
      ]
    );

    return teams;
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
          $project: {
            teamId: 1,
						ballPossession: 1,
            seasonId: 1
          }
        },
        {
          $sort: {
            ballPossession: -1,
          },
        },
        {
          $lookup: {
            from: "teams",
            localField: "teamId",
            foreignField: "_id",
            as: "team"
          }
        },
  			{
    			$unwind: {
    			  path: "$team",
    			  }
  			}
      ]
    );
    return teams;
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
    const selection = 'scoringTiming.'.concat(periods[period]).concat('.count')

    const teams = await this.statModel.aggregate(
      [
        {
          $match: {
            seasonId: seasonId,
          },
        },
        {
          $project: {
            _id: 1,
            teamId: 1,
            [selection]: 1,
            seasonId: 1
          }
        },
        {
          $sort: {
            [selection]: -1,
          },
        },
        {
          $lookup: {
            from: "teams",
            localField: "teamId",
            foreignField: "_id",
            as: "team"
          }
        },
        {
          $unwind: {
            path: "$team",
            }
        }
      ]
    );
    return teams;
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

    const selection = 'goalsConcededTiming.'.concat(periods[period]).concat('.count')

    const teams = await this.statModel.aggregate(
      [
        {
          $match: {
            seasonId: seasonId,
          },
        },
        {
          $project: {
            _id: 1,
            teamId: 1,
            [selection]: 1,
            seasonId: 1
          }
        },
        {
          $sort: {
            [selection]: -1,
          },
        },
        {
          $lookup: {
            from: "teams",
            localField: "teamId",
            foreignField: "_id",
            as: "team"
          }
        },
        {
          $unwind: {
            path: "$team",
            }
        }
      ]
    );
    return teams;
  }
}
