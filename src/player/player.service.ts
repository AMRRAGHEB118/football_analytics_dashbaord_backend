import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from './schema/player.schema';
import { DataImportService } from 'src/services/dataImport/data.import.service';



@Injectable()
export class PlayerService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
    private readonly importService: DataImportService,
  ) { }

  // TODO: Add findAll method

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
}
