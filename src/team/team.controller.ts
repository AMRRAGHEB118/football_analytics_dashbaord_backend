import { Controller, Get, HttpStatus, Param, ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { TeamService } from './team.service';


@Controller('team')
export class TeamController {
  constructor(private teamService: TeamService) { }

  @Get(':id/:seasonId')
  getTeam(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Param('seasonId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) seasonId: number) {
    return this.teamService.findOne(id, seasonId);
  }

  @Get(':id')
  @UsePipes(new ValidationPipe())
  reloadTeam(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.teamService.reloadTeam(id);
  }

  @Get()
  fetchAll() {
    return this.teamService.fetchAllTeams();
  }
}
