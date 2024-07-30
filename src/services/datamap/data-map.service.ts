import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model} from 'mongoose';
import { Player, PlayerDocument } from '../../player/schema/player.schema';
import { Team, TeamDocument } from 'src/team/schema/team.schema';
import { TeamStatDocument, TeamStatistics } from 'src/team/schema/teamStats.schema';
import {
  Statistics,
  StatisticsDocument,
} from '../../player/schema/statistics.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DataMapService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
    @InjectModel(Statistics.name) private statisticsModel: Model<StatisticsDocument>,
    @InjectModel(Team.name) private teamModel: Model<TeamDocument>,
    @InjectModel(TeamStatistics.name) private teamStat: Model<TeamStatDocument>,
    private readonly configService: ConfigService,
  ) { }

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
      seasonId: stat.season_id,
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
        seasonId: stat.seasonId,
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

  async mapAndSaveTeamData(apiData: any): Promise<Team> {
    const teamData = apiData.data;
    const mongoTeam = await this.teamModel.findOne({ id: teamData.id }).exec();

    mongoTeam.name = teamData.name; 
    mongoTeam.shortCode = teamData.short_code;
    mongoTeam.imgPath = teamData.image_path;
    mongoTeam.statistics = [];

    await this.teamStat.deleteMany({})
    
    if (teamData.statistics.length === 0) {
      return mongoTeam;
    }

    const seasons = this.configService.get<string>('SEASONS').split(',');
    const teamStatData = teamData.statistics
      .filter((stat: any) => seasons.includes(String(stat.season_id)))
      .map((stat: any) => {
        if (this.configService.get<string>('SEASONS').split(',').includes(String(stat.season_id))) {
          return {
            teamId: mongoTeam._id,
            seasonId: stat.season_id,
            scoringTiming: stat.details.find((d: any) => d.type_id === 196)?.value,
            goalsConcededTiming: stat.details.find((d: any) => d.type_id === 213)?.value,
            goalsScoredHome: stat.details.find((d: any) => d.type_id === 52)?.value?.home?.count,
            goalsScoredAway: stat.details.find((d: any) => d.type_id === 52)?.value?.away?.count,
            totalGoalsScored: stat.details.find((d: any) => d.type_id === 52)?.value?.all?.count,
            goalsConcededHome: stat.details.find((d: any) => d.type_id === 88)?.value?.home?.count,
            goalsConcededAway: stat.details.find((d: any) => d.type_id === 88)?.value?.away?.count,
            totalGoalsConceded: stat.details.find((d: any) => d.type_id === 88)?.value?.all?.count,
            yellowCards: stat.details.find((d: any) => d.type_id === 84)?.value?.count,
            redCards: stat.details.find((d: any) => d.type_id === 83)?.value?.count,
            ballPossession: stat.details.find((d: any) => d.type_id === 45)?.value?.average,
            lostHome: stat.details.find((d: any) => d.type_id === 216)?.value?.home?.count,
            lostAway: stat.details.find((d: any) => d.type_id === 216)?.value?.away?.count,
            winHome: stat.details.find((d: any) => d.type_id === 214)?.value?.home?.count,
            winAway: stat.details.find((d: any) => d.type_id === 214)?.value?.away?.count,
            drawHome: stat.details.find((d: any) => d.type_id === 215)?.value?.home?.count,
            drawAway: stat.details.find((d: any) => d.type_id === 215)?.value?.away?.count,
            corners: stat.details.find((d: any) => d.type_id === 34)?.value?.count,
            cleanSheets: stat.details.find((d: any) => d.type_id === 194)?.value?.all?.count,
            failedToScore: stat.details.find((d: any) => d.type_id === 575)?.value?.all?.count,
          }
        }
      });

    const stats = await Promise.all(teamStatData.map(async (stat: any) => {
      try {
        const newStat = await this.teamStat.create(stat);
        return newStat._id;
      } catch (error) {
        console.error('Error creating teamStat:', error);
      }
    }));
    mongoTeam.statistics = stats;
    return await this.teamModel.findByIdAndUpdate(mongoTeam._id, mongoTeam, { new:true }).exec();
  }
}
