import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from '../../player/schema/player.schema';
import {
  Statistics,
  StatisticsDocument,
} from '../../player/schema/statistics.schema';

@Injectable()
export class DataMapService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
    @InjectModel(Statistics.name)
    private statisticsModel: Model<StatisticsDocument>,
  ) {}

  async mapAndSavePlayerData(apiData: any): Promise<void> {
    const playerData = apiData.data;

    let player = await this.playerModel.findOne({ id: playerData.id });
    if (!player) {
      player = new this.playerModel({
        id: playerData.id,
        teamId: playerData.team_id,
        position: playerData.position.name,
        detailedPosition: playerData.detailedposition.name,
        commonName: playerData.common_name,
        firstName: playerData.firstname,
        lastName: playerData.lastname,
        name: playerData.name,
        displayName: playerData.display_name,
        imagePath: playerData.image_path,
        height: playerData.height,
        weight: playerData.weight,
        dateOfBirth: playerData.date_of_birth,
        statistics: [],
      });
      await player.save();
    }

    const statisticsData = playerData.statistics.map((stat: any) => ({
      playerId: player._id,
      sessionId: stat.season_id,
      totalGoals:
        stat.details.find((d: any) => d.type_id === 52)?.value?.total || 0,
      goals: stat.details.find((d: any) => d.type_id === 52)?.value?.goals || 0,
      penalties:
        stat.details.find((d: any) => d.type_id === 52)?.value?.penalties || 0,
      assists:
        stat.details.find((d: any) => d.type_id === 79)?.value?.total || 0,
      yellowCardsAway:
        stat.details.find((d: any) => d.type_id === 84)?.value?.away || 0,
      yellowCardsHome:
        stat.details.find((d: any) => d.type_id === 84)?.value?.home || 0,
      yellowCards:
        stat.details.find((d: any) => d.type_id === 84)?.value?.total || 0,
      minutesPlayed:
        stat.details.find((d: any) => d.type_id === 119)?.value?.total || 0,
      appearances:
        stat.details.find((d: any) => d.type_id === 321)?.value?.total || 0,
      lineups:
        stat.details.find((d: any) => d.type_id === 322)?.value?.total || 0,
      goalsConceded:
        stat.details.find((d: any) => d.type_id === 88)?.value?.total || 0,
      cleanSheets:
        stat.details.find((d: any) => d.type_id === 194)?.value?.total || 0,
      cleanSheetsHome:
        stat.details.find((d: any) => d.type_id === 194)?.value?.home || 0,
      cleanSheetsAway:
        stat.details.find((d: any) => d.type_id === 194)?.value?.away || 0,
      ownGoals:
        stat.details.find((d: any) => d.type_id === 324)?.value?.total || 0,
    }));

    for (const stat of statisticsData) {
      const existingStat = await this.statisticsModel.findOne({
        playerId: player._id,
        sessionId: stat.sessionId,
      });

      if (existingStat) {
        const updatedStat = await existingStat.updateOne(stat);
        if (!updatedStat) {
          throw new HttpException('Failed to update player statistics', 400);
        }

        await player.updateOne({
          $push: {
            statistics: updatedStat._id,
          },
        });
      } else {
        const newStat = await this.statisticsModel.create(stat);
        if (!newStat) {
          throw new HttpException('Failed to create player statistics', 400);
        }

        await player.updateOne({
          $push: {
            statistics: newStat._id,
          },
        });
      }
    }

    return Promise.resolve();
  }
}
