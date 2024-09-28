import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Team } from './schema/team.schema';
import { Model } from 'mongoose';
import { DataImportService } from 'src/services/dataImport/data.import.service';
import { LoggerService } from 'src/services/logger/logger.service';



@Injectable()
export class TeamService {
  constructor(@InjectModel(Team.name) private teamModel: Model<Team>,
    private readonly dataImport: DataImportService,
    private readonly loggerService: LoggerService
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
}
