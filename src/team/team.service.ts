import { Injectable } from '@nestjs/common';
import { Team } from './schema/team.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataImportService } from 'src/services/dataImport/data.import.service';

@Injectable()
export class TeamService {
  constructor(@InjectModel(Team.name) private teamModel: Model<Team>,
    private readonly dataImport: DataImportService) { }

  async findOne(id: number, seasonId: number) {
    const team = await this.teamModel.findOne({ id })
      .populate({ path: 'statistics', match: { seasonId: seasonId } }).exec();

    if (!team) {
      return {
        "message": "Team Not Found!",
        "status": 404,
        "data": []
      }
    }
    return {
      "message": "Team returned successfully",
      "status": 200,
      "data": [team]
    };
  }

  async reloadTeam(id: number) {
    const reloadedTeam = await this.dataImport.importTeam(id);
    if (reloadedTeam)
      return {
        "message": "Team reloaded successfully",
        "status": 200,
        "data": [reloadedTeam],
      }
    else return {
      "message": "Team not found ,Please make sure of the id",
      "status": 404,
      "data": [reloadedTeam],
    }
  }

  async fetchAllTeams() {
    const teams = await this.dataImport.fetchAllTeams();
    if (teams)
      return {
        "message": "Teams fetched successfully",
        "status": 200,
        "data": teams,
      }
    else return {
      "message": "Error happened while fetching please try again",
      "status": 500,
      "data": teams,
    }
  }
}
