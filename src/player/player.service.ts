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
        },
        {
          $lookup: {
            from: "seasons",
            localField: "seasonId",
            foreignField: "id",
            as: "season"
          }
        },
        {
          $unwind: {
            path: "$season",
          }
        },
        {
          $lookup: {
            from: "teams",
            localField: "player.teamId",
            foreignField: "id",
            as: "team"
          }
        },
        {
          $unwind: {
            path: "$team",
          }
        },
        {
          $project: {
            appearances: 1,
            totalGoals: 1,
            goals: 1,
            penalties: 1,
            'season': '$season.name',
            'player._id': 1,
            'player.name': 1,
            'player.detailedPosition': 1,
            'player.team._id': '$team._id',
            'player.team.name': '$team.name',
            'player.team.imgPath': '$team.imgPath',
          }
        },
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
        },
        {
          $lookup: {
            from: "teams",
            localField: "player.teamId",
            foreignField: "id",
            as: "team"
          }
        },
        {
          $unwind: {
            path: "$team",
          }
        },
        {
          $lookup: {
            from: "seasons",
            localField: "seasonId",
            foreignField: "id",
            as: "season"
          }
        },
        {
          $unwind: {
            path: "$season",
          }
        },
        {
          $project: {
            appearances: 1,
            assists: 1,
            'season': '$season.name',
            'player._id': 1,
            'player.name': 1,
            'player.detailedPosition': 1,
            'player.team._id': '$team._id',
            'player.team.name': '$team.name',
            'player.team.imgPath': '$team.imgPath',
          }
        },
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
        },
        {
          $lookup: {
            from: "teams",
            localField: "player.teamId",
            foreignField: "id",
            as: "team"
          }
        },
        {
          $unwind: {
            path: "$team",
          }
        },
        {
          $lookup: {
            from: "seasons",
            localField: "seasonId",
            foreignField: "id",
            as: "season"
          }
        },
        {
          $unwind: {
            path: "$season",
          }
        },
        {
          $project: {
            yellowCards: 1,
            'season': '$season.name',
            'player._id': 1,
            'player.name': 1,
            'player.detailedPosition': 1,
            'player.team._id': '$team._id',
            'player.team.name': '$team.name',
            'player.team.imgPath': '$team.imgPath',
          }
        },
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
        },
        {
          $lookup: {
            from: "teams",
            localField: "player.teamId",
            foreignField: "id",
            as: "team"
          }
        },
        {
          $unwind: {
            path: "$team",
          }
        },
        {
          $lookup: {
            from: "seasons",
            localField: "seasonId",
            foreignField: "id",
            as: "season"
          }
        },
        {
          $unwind: {
            path: "$season",
          }
        },
        {
          $project: {
            appearances: 1,
            goals: '$totalGoals',
            assists: 1,
            contributions: { '$add': ['$totalGoals', '$assists'] },
            'season': '$season.name',
            'player._id': 1,
            'player.name': 1,
            'player.detailedPosition': 1,
            'player.team._id': '$team._id',
            'player.team.name': '$team.name',
            'player.team.imgPath': '$team.imgPath',
          }
        },
        {
          $sort: {
            contributions: -1,
          }
        },
        {
          $limit: 20
        },
      ]
    );
    return players;
  }
}
