import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DataImportService } from 'src/services/dataImport/data.import.service';
import { Season, SeasonDocment } from './schema/season.schema';
import { Model } from 'mongoose';
import _Response from 'src/types';

@Injectable()
export class SeasonService {
  constructor(
    private readonly dataImport: DataImportService,
    @InjectModel(Season.name) private seasonModel: Model<SeasonDocment>,
  ) {}

  async fetchSeasons(): Promise<_Response> {
    return this.dataImport.fetchSeasons();
  }

  async getSeasons(): Promise<object> {
    return this.seasonModel.find().sort({ name: -1 }).exec();
  }
}
