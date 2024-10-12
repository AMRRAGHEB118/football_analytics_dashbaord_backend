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

  @Get('statistics/top-score/:seasonId')
  async getTopScorerOfSeason(
    @Param('seasonId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    seasonId: number,
    @Res() response: Response) {
    try {
      const result = await this.teamService.getTopScorerOfSeason(seasonId);

      if (!result || result.length === 0) {
        this.loggerService.logError
          (
            `No statistics found for season: ${seasonId}`,
            "team/statistics/top-of-season/:seasonId",
            "GET", 404, LoggerModule.TEAM
          );
        return response.status(404).send({
          "message": "No statistics found for this season!",
          "status": 404,
          "data": [],
        });
      };
      this.loggerService.logInfo
        (
          `Statistics retieved successfully for season: ${seasonId}`,
          "team/statistics/top-of-season/:seasonId",
          "GET", 500, LoggerModule.TEAM
        )

      return response.status(200).send({
        "message": "Top socorer teams retrieved successfully",
        "status": 200,
        "data": result
      });
    } catch (error) {
      this.loggerService.logError
        (
          `Server Error happened while finding statistics for season: ${seasonId}`,
          "team/statistics/top-of-season/:seasonId",
          "GET", 500, LoggerModule.TEAM, error
        );
      return response.status(500).send({
        "message": "Server Error happened",
        "status": 500,
        "data": [],
      });
    }
  }

  @Get('statistics/failed-to-score/:seasonId')
  async getMostFailedToScore(
    @Param('seasonId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    seasonId: number,
    @Res() response: Response) {
    try {
      const result = await this.teamService.getMostFailedToScore(seasonId);

      if (!result || result.length === 0) {
        this.loggerService.logError
          (
            `No statistics found for season: ${seasonId}`,
            "team/statistics/failed-to-score/:seasonId",
            "GET", 404, LoggerModule.TEAM
          );
        return response.status(404).send({
          "message": "No statistics found for this season!",
          "status": 404,
          "data": [],
        });
      };
      this.loggerService.logInfo
        (
          `Statistics retieved successfully for season: ${seasonId}`,
          "team/statistics/failed-to-score/:seasonId",
          "GET", 500, LoggerModule.TEAM
        )

      return response.status(200).send({
        "message": "Failed to score teams retrieved successfully",
        "status": 200,
        "data": result
      });
    } catch (error) {
      this.loggerService.logError
        (
          `Server Error happened while finding statistics for season: ${seasonId}`,
          "team/statistics/failed-to-score/:seasonId",
          "GET", 500, LoggerModule.TEAM, error
        );
      return response.status(500).send({
        "message": "Server Error happened",
        "status": 500,
        "data": [],
      });
    }
  }

  @Get('statistics/most-possessed/:seasonId')
  async getMostPosessed(
    @Param('seasonId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    seasonId: number,
    @Res() response: Response) {
    try {
      const result = await this.teamService.getMostPossessed(seasonId);

      if (!result || result.length === 0) {
        this.loggerService.logError
          (
            `No statistics found for season: ${seasonId}`,
            "team/statistics/most-possessed/:seasonId",
            "GET", 404, LoggerModule.TEAM
          );
        return response.status(404).send({
          "message": "No statistics found for this season!",
          "status": 404,
          "data": [],
        });
      };
      this.loggerService.logInfo
        (
          `Statistics retieved successfully for season: ${seasonId}`,
          "team/statistics/most-possessed/:seasonId",
          "GET", 500, LoggerModule.TEAM
        )

      return response.status(200).send({
        "message": "Most possessed teams retrieved successfully",
        "status": 200,
        "data": result
      });
    } catch (error) {
      this.loggerService.logError
        (
          `Server Error happened while finding statistics for season: ${seasonId}`,
          "team/statistics/most-possessed/:seasonId",
          "GET", 500, LoggerModule.TEAM, error
        );
      return response.status(500).send({
        "message": "Server Error happened",
        "status": 500,
        "data": [],
      });
    }
  }

  @Get('statistics/score-of-period/:seasonId/:period')
  async getTopScorersOfPeriod(
    @Param('seasonId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    seasonId: number,
    @Param('period',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    period: number,
    @Res() response: Response) {
    try {
      const result = await this.teamService.getTopScorersOfPeriod(seasonId, period);

      if (!result || result.length === 0) {
        this.loggerService.logError
          (
            `No statistics found for season: ${seasonId}`,
            "team/statistics/score-of-period/:seasonId",
            "GET", 404, LoggerModule.TEAM
          );
        return response.status(404).send({
          "message": "No statistics found for this season!",
          "status": 404,
          "data": [],
        });
      };
      this.loggerService.logInfo
        (
          `Statistics retieved successfully for season: ${seasonId}`,
          "team/statistics/score-of-period/:seasonId",
          "GET", 500, LoggerModule.TEAM
        )

      return response.status(200).send({
        "message": "Scoring periods of teams retrieved successfully",
        "status": 200,
        "data": result
      });
    } catch (error) {
      this.loggerService.logError
        (
          `Server Error happened while finding statistics for season: ${seasonId}`,
          "team/statistics/score-of-period/:seasonId",
          "GET", 500, LoggerModule.TEAM, error
        );
      return response.status(500).send({
        "message": "Server Error happened",
        "status": 500,
        "data": [],
      });
    }
  }

  @Get('statistics/conceded-of-period/:seasonId/:period')
  async getMostScoredAtOfPeriod(
    @Param('seasonId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    seasonId: number,
    @Param('period',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    period: number,
    @Res() response: Response) {
    try {
      const result = await this.teamService.getMostScoredAtOfPeriod(seasonId, period);

      if (!result || result.length === 0) {
        this.loggerService.logError
          (
            `No statistics found for season: ${seasonId}`,
            "team/statistics/conceded-of-period/:seasonId",
            "GET", 404, LoggerModule.TEAM
          );
        return response.status(404).send({
          "message": "No statistics found for this season!",
          "status": 404,
          "data": [],
        });
      };
      this.loggerService.logInfo
        (
          `Statistics retieved successfully for season: ${seasonId}`,
          "team/statistics/conceded-of-period/:seasonId",
          "GET", 200, LoggerModule.TEAM
        )

      return response.status(200).send({
        "message": "Goals conceded periods of teams retrieved successfully",
        "status": 200,
        "data": result
      });
    } catch (error) {
      this.loggerService.logError
        (
          `Server Error happened while finding statistics for season: ${seasonId}`,
          "team/statistics/conceded-of-period/:seasonId",
          "GET", 500, LoggerModule.TEAM, error
        );
      return response.status(500).send({
        "message": "Server Error happened",
        "status": 500,
        "data": [],
      });
    }
  }
}
