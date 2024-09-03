import { Controller, Get } from '@nestjs/common';
import { SeasonService } from './season.service';

@Controller('season')
export class SeasonController {
  constructor( private seasonService: SeasonService) {}

  @Get()
  async getSeasons() {
    return this.seasonService.getSeasons()
  }
}
