import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from './schema/player.schema';
import { DataImportService } from 'src/services/dataImport/data.import.service';

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
    private readonly importService: DataImportService,
  ) {}

  // TODO: Add findAll method

  async findOne(id: number): Promise<Player> {
    let player = await this.playerModel
      .findOne({ id })
      .populate('statistics')
      .exec();

    if (!player) {
      await this.importService.importPlayerData(id);
      player = await this.playerModel
        .findOne({ id })
        .populate('statistics')
        .exec();
    }

    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }

    return player;
  }
}
