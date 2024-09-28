import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  Res,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { LoggerService } from 'src/services/logger/logger.service';
import { LoggerModule } from 'src/services/logger/logger.schema';
import { Response } from 'express';



@Controller('team')
export class TeamController {
  constructor(private teamService: TeamService,
    private readonly loggerService: LoggerService
  ) { }

  @Get(':id/:seasonId')
  async getTeam(
    @Param('id', new ParseIntPipe(
      { errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Param('seasonId', new ParseIntPipe(
      { errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) seasonId: number,
    @Res() response: Response
  ) {

    try {
      const result = await this.teamService.findOne(id, seasonId);

      if (!result) {
        this.loggerService.logError
          (
            "Team not found",
            "/team/:id/:seasonId",
            "GET",
            404,
            LoggerModule.TEAM,
            "This team doesn't exist in the database"
          );
        return response.status(404)
          .send
          ({
            "message": "Team not found ,Please make sure of team id",
            "status_code": 404,
            "data": []
          });
      }
      this.loggerService.logInfo
        (
          `Team => ${id} for season => ${seasonId} found successfully`,
          "/team/:id", "GET", 200, LoggerModule.TEAM
        );
      return response.status(200)
        .send
        ({
          "message": "Team found successfully",
          "status_code": 200,
          "data": [result]
        });

    } catch (err) {
      this.loggerService.logError
        (
          `Error retrieving (team: ${id}) data` +
          `for (season: ${seasonId}) from database`,
          '/team/:id/:seasonId',
          'GET',
          500,
          LoggerModule.TEAM,
          err
        );
      return response.status(500)
        .send
        ({
          "message":
            `Error retrieving {team: ${id}} data for` +
            `{season: ${seasonId}} from database`,
          "status_code": 500,
          "data": []
        });
    }
  }

  @Get(':id')
  @UsePipes(new ValidationPipe())
  async reloadTeam
    (
      @Param('id', new ParseIntPipe(
        { errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
      @Res() response: Response
    ) {
    const result = await this.teamService.reloadTeam(id);
    if (result.status_code == 200) {
      this.loggerService.logInfo
        (
          `Team ${id} reloaded successfully`,
          "/team/:id", "GET", 200, LoggerModule.TEAM
        );
      return response.status(200)
        .send({
          "message": "Team reloaded successfully",
          "status_code": 200,
          "data": [result.data]
        });
    }
    else if (result.status_code == 404) {
      this.loggerService.logError
        (
          `Team ${id} doesn't exist`,
          "/team/:id", "GET", 404, LoggerModule.TEAM
        );
      return response.status(404)
        .send({
          "message": "Team not found ,Please make sure of team id",
          "status_code": 404,
          "data": []
        });
    }
    else {
      this.loggerService.logError
        (
          `Server error happened while reloading Team => ${id}`,
          "/team/:id", "GET", 500, LoggerModule.TEAM, result.err
        );
      return response.status(500)
        .send
        ({
          "message":
            "Error happened while reloading the team, please try again later",
          "status_code": 500,
          "data": [],
        });
    }

  }

  @Get()
  async fetchAll(@Res() response: Response) {
    const result = await this.teamService.fetchAllTeams();
    if (result.status_code == 200) {
      this.loggerService.logInfo
        (
          `Teams fetched successfully`,
          "/team", "GET", 200, LoggerModule.TEAM
        );
      return response.status(200)
        .send
        ({
          "message": "Teams fetched successfully",
          "status_code": 200,
          "data": [result.data]
        });
    }


    else {
      this.loggerService.logError
        (
          "Server error happened while fethcing teams",
          "/team", "GET", 500, LoggerModule.TEAM, result.err
        );
      return response.status(500)
        .send
        ({
          "message": "Error happened while fetching, please try again later",
          "status_code": 500,
          "data": []
        });
    }

  }
}
