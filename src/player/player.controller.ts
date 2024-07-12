import { Controller, Get, Param } from '@nestjs/common';
import { PlayerService } from './player.service';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const player = await this.playerService.findOne(id);
    return { data: { player } };
  }
}
