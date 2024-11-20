import { Injectable } from '@nestjs/common';
import { League, LeagueDocument } from './schema/league.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class LeagueService {
  constructor(
    @InjectModel(League.name) private leagueModel: Model<LeagueDocument>,
  ) {}

  async listLeagues() {
    return this.leagueModel
      .find({}, { _id: 1, id: 1, imagePath: 1, name: 1 })
      .exec();
  }

  async getLeague(id: number) {
    return this.leagueModel.find(
      { id },
      { _id: 1, id: 1, name: 1, imagePath: 1 },
    );
  }
}
