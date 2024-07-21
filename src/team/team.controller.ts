import { Controller, Get, Param } from '@nestjs/common';
import { TeamService } from './team.service';


@Controller('team')
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Get(':id/:seasonId')
  getTeam(@Param('id') id: number,@Param('seasonId') seasonId: number) {
    return this.teamService.findOne(id, seasonId);
  }
}
