import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from './schema/player.schema';
import { DataImportService } from 'src/services/dataImport/data.import.service';
import { Statistics } from './schema/statistics.schema';


@Injectable()
export class PlayerService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
    @InjectModel(Statistics.name) private statModel: Model<Statistics>,
    private readonly importService: DataImportService,
  ) { }

  async findAll() {
    return this.importService.getPlayersData();
  }

  async findOne(id: number): Promise<any> {
    try {
      let player = await this.playerModel
        .findOne({ id })
        .populate('statistics')
        .exec();

      if (!player) {
        const result = await this.importService.importPlayerData(id);
        if (result.status_code == 200) {
          player = await this.playerModel
            .findOne({ id })
            .populate('statistics')
            .exec();
          result.data = player;
        }
        return result;
      }
      return {
        "err": "",
        "status_code": 200,
        "data": player
      }
    } catch (err) {
      return {
        "err": err,
        "status_code": 500,
        "data": null
      }
    }
  }



  async getTopScorerOfSeason(seasonId: number) {
    const players = await this.statModel.aggregate(
      [
        {
          $match: {
            seasonId: seasonId
          }
        },
        {
          $sort: {
            totalGoals: -1
          }
        },
        {
          $project: {
            playerId: 1,
            totalGoals: 1,
            goals: 1,
            penalties: 1,
            seasonId: 1
          }
        },
        {
          $limit: 20
        },
        {
          $lookup: {
            from: "players",
            localField: "playerId",
            foreignField: "_id",
            as: "player"
          }
        },
        {
          $unwind: {
            path: "$player",
          }
        }
      ]
    );
    return players
  }

  async getTopAssistantOfSeason(seasonId: number) {
    const players = await this.statModel.aggregate(
      [
        {
          $match: {
            seasonId: seasonId
          }
        },
        {
          $sort: {
            assists: -1
          }
        },
        {
          $project: {
            playerId: 1,
            assists: 1,
            seasonId: 1
          }
        },
        {
          $limit: 20
        },
        {
          $lookup: {
            from: "players",
            localField: "playerId",
            foreignField: "_id",
            as: "player"
          }
        },
        {
          $unwind: {
            path: "$player",
          }
        }
      ]
    );
    return players
  }

  async getTopYellowCard(seasonId: number) {
    const players = await this.statModel.aggregate(
      [
        {
          $match: {
            seasonId: seasonId
          }
        },
        {
          $sort: {
            yellowCards: -1
          }
        },
        {
          $project: {
            playerId: 1,
            seasonId: 1,
            yellowCards: 1,
          }
        },
        {
          $limit: 20
        },
        {
          $lookup: {
            from: "players",
            localField: "playerId",
            foreignField: "_id",
            as: "player"
          }
        },
        {
          $unwind: {
            path: "$player",
          }
        }
      ]
    );
    return players
  }

  async getTopContributions(seasonId: number) {
    const players = await this.statModel.aggregate(
      [
        {
          $match: {
            seasonId: seasonId
          }
        },
        {
          $project: {
            playerId: 1,
            goals: '$totalGoals',
            assists: 1,
            seasonId: 1,
            contributions: { '$add': ['$totalGoals', '$assists'] },
          }
        },
        {
          $sort: {
            contributions: -1
          }
        },
        {
          $limit: 20
        },
        {
          $lookup: {
            from: "players",
            localField: "playerId",
            foreignField: "_id",
            as: "player"
          }
        },
        {
          $unwind: {
            path: "$player",
          }
        }
      ]);
    return players;
  }
}
