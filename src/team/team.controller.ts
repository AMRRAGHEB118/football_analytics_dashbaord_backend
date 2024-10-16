import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { LoggerService } from 'src/services/logger/logger.service';
import { LoggerModule } from 'src/services/logger/logger.schema';
import { Response } from 'express';
import { Types } from 'mongoose';

@Controller('team')
export class TeamController {
  constructor(
    private teamService: TeamService,
    private readonly loggerService: LoggerService,
  ) {}

  @Get(':id/:seasonId')
  async getTeam(
    id: Types.ObjectId,
    @Param(
      'seasonId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    seasonId: number,
    @Res() response: Response,
  ) {
    const s: number = performance.now();
    try {
      const result = await this.teamService.findOne(id, seasonId);
      let duration: number = performance.now() - s;
      duration = parseFloat((duration / 1000).toFixed(2));

      if (!result) {
        this.loggerService.logError(
          `Team ${id} not found`,
          '/team/:id/:seasonId',
          'GET',
          404,
          LoggerModule.TEAM,
          duration,
        );
        return response.status(404).send({
          message: 'Team not found ,Please make sure of team id',
          status_code: 404,
          data: [],
        });
      }
      this.loggerService.logInfo(
        `Team => ${id} for season => ${seasonId} found successfully`,
        '/team/:id',
        'GET',
        200,
        LoggerModule.TEAM,
      );
      return response.status(200).send({
        message: 'Team found successfully',
        status_code: 200,
        data: [result],
      });
    } catch (err) {
      this.loggerService.logError(
        `Error retrieving (team: ${id}) data` +
          `for (season: ${seasonId}) from database`,
        '/team/:id/:seasonId',
        'GET',
        500,
        LoggerModule.TEAM,
        err,
      );
      return response.status(500).send({
        message:
          `Error retrieving {team: ${id}} data for` +
          `{season: ${seasonId}} from database`,
        status_code: 500,
        data: [],
      });
    }
  }

  @Get(':id')
  async reloadTeam(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Res() response: Response,
  ) {
    const s: number = performance.now();
    let duration: number = performance.now() - s;
    duration = parseFloat((duration / 1000).toFixed(2));
    const result = await this.teamService.reloadTeam(id);
    if (result.status_code == 200) {
      this.loggerService.logInfo(
        `Team ${id} reloaded successfully`,
        '/team/:id',
        'GET',
        200,
        LoggerModule.TEAM,
        duration,
      );
      return response.status(200).send({
        message: 'Team reloaded successfully',
        status_code: 200,
        data: [result.data],
      });
    } else if (result.status_code == 404) {
      this.loggerService.logError(
        `Team ${id} doesn't exist`,
        '/team/:id',
        'GET',
        404,
        LoggerModule.TEAM,
        duration
      );
      return response.status(404).send({
        message: 'Team not found ,Please make sure of team id',
        status_code: 404,
        data: [],
      });
    } else {
      let duration: number = performance.now() - s;
      duration = parseFloat((duration / 1000).toFixed(2));
      this.loggerService.logError(
        `Server error happened while reloading Team => ${id}`,
        '/team/:id',
        'GET',
        500,
        LoggerModule.TEAM,
        duration,
        result.err,
      );
      return response.status(500).send({
        message:
          'Error happened while reloading the team, please try again later',
        status_code: 500,
        data: [],
      });
    }
  }

  @Get()
  async fetchAll(@Res() response: Response) {
    const s: number = performance.now();

    const result = await this.teamService.fetchAllTeams();
    let duration: number = performance.now() - s;
    duration = parseFloat((duration / 1000).toFixed(2));
    if (result.status_code == 200) {
      this.loggerService.logInfo(
        `Teams fetched successfully`,
        '/team',
        'GET',
        200,
        LoggerModule.TEAM,
        duration,
      );
      return response.status(200).send({
        message: 'Teams fetched successfully',
        status_code: 200,
        data: [result.data],
      });
    } else {
      this.loggerService.logError(
        'Server error happened while fethcing teams',
        '/team',
        'GET',
        500,
        LoggerModule.TEAM,
        duration,
        result.err,
      );
      return response.status(500).send({
        message: 'Error happened while fetching, please try again later',
        status_code: 500,
        data: [],
      });
    }
  }

  @Get('statistics/top-score/:seasonId')
  async getTopScorerOfSeason(
    @Param(
      'seasonId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    seasonId: number,
    @Res() response: Response,
  ) {
    const s: number = performance.now();

    try {
      const result = await this.teamService.getTopScorerOfSeason(seasonId);
      let duration: number = performance.now() - s;
      duration = parseFloat((duration / 1000).toFixed(2));

      if (!result || result.length === 0) {
        this.loggerService.logError(
          `No statistics found for season: ${seasonId}`,
          'team/statistics/top-of-season/:seasonId',
          'GET',
          404,
          LoggerModule.TEAM,
          duration,
        );
        return response.status(404).send({
          message: 'No statistics found for this season!',
          status: 404,
          data: [],
        });
      }
      this.loggerService.logInfo(
        `Statistics retieved successfully for season: ${seasonId}`,
        'team/statistics/top-of-season/:seasonId',
        'GET',
        500,
        LoggerModule.TEAM,
        duration,
      );

      return response.status(200).send({
        message: 'Top socorer teams retrieved successfully',
        status: 200,
        data: result,
      });
    } catch (error) {
      let duration: number = performance.now() - s;
      duration = parseFloat((duration / 1000).toFixed(2));
      this.loggerService.logError(
        `Server Error happened while finding statistics for season: ${seasonId}`,
        'team/statistics/top-of-season/:seasonId',
        'GET',
        500,
        LoggerModule.TEAM,
        duration,
        error,
      );
      return response.status(500).send({
        message: 'Server Error happened',
        status: 500,
        data: [],
      });
    }
  }

  @Get('statistics/failed-to-score/:seasonId')
  async getMostFailedToScore(
    @Param(
      'seasonId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    seasonId: number,
    @Res() response: Response,
  ) {
    const s: number = performance.now();

    try {
      const result = await this.teamService.getMostFailedToScore(seasonId);
      let duration: number = performance.now() - s;
      duration = parseFloat((duration / 1000).toFixed(2));

      if (!result || result.length === 0) {
        this.loggerService.logError(
          `No statistics found for season: ${seasonId}`,
          'team/statistics/failed-to-score/:seasonId',
          'GET',
          404,
          LoggerModule.TEAM,
          duration
        );
        return response.status(404).send({
          message: 'No statistics found for this season!',
          status: 404,
          data: [],
        });
      }
      this.loggerService.logInfo(
        `Statistics retieved successfully for season: ${seasonId}`,
        'team/statistics/failed-to-score/:seasonId',
        'GET',
        500,
        LoggerModule.TEAM,
        duration
      );

      return response.status(200).send({
        message: 'Failed to score teams retrieved successfully',
        status: 200,
        data: result,
      });
    } catch (error) {
      let duration: number = performance.now() - s;
      duration = parseFloat((duration / 1000).toFixed(2));
      this.loggerService.logError(
        `Server Error happened while finding statistics for season: ${seasonId}`,
        'team/statistics/failed-to-score/:seasonId',
        'GET',
        500,
        LoggerModule.TEAM,
        duration,
        error,
      );
      return response.status(500).send({
        message: 'Server Error happened',
        status: 500,
        data: [],
      });
    }
  }

  @Get('statistics/most-possessed/:seasonId')
  async getMostPosessed(
    @Param(
      'seasonId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    seasonId: number,
    @Res() response: Response,
  ) {
    const s: number = performance.now();
    try {
      const result = await this.teamService.getMostPossessed(seasonId);
      let duration: number = performance.now() - s;
      duration = parseFloat((duration / 1000).toFixed(2));

      if (!result || result.length === 0) {
        this.loggerService.logError(
          `No statistics found for season: ${seasonId}`,
          'team/statistics/most-possessed/:seasonId',
          'GET',
          404,
          LoggerModule.TEAM,
          duration
        );
        return response.status(404).send({
          message: 'No statistics found for this season!',
          status: 404,
          data: [],
        });
      }
      this.loggerService.logInfo(
        `Statistics retieved successfully for season: ${seasonId}`,
        'team/statistics/most-possessed/:seasonId',
        'GET',
        500,
        LoggerModule.TEAM,
        duration
      );

      return response.status(200).send({
        message: 'Most possessed teams retrieved successfully',
        status: 200,
        data: result,
      });
    } catch (error) {
      let duration: number = performance.now() - s;
      duration = parseFloat((duration / 1000).toFixed(2));
      this.loggerService.logError(
        `Server Error happened while finding statistics for season: ${seasonId}`,
        'team/statistics/most-possessed/:seasonId',
        'GET',
        500,
        LoggerModule.TEAM,
        duration,
        error,
      );
      return response.status(500).send({
        message: 'Server Error happened',
        status: 500,
        data: [],
      });
    }
  }

  @Get('statistics/score-of-period/:seasonId/:period')
  async getTopScorersOfPeriod(
    @Param(
      'seasonId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    seasonId: number,
    @Param(
      'period',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    period: number,
    @Res() response: Response,
  ) {
    const s: number = performance.now();
    try {
      const result = await this.teamService.getTopScorersOfPeriod(
        seasonId,
        period,
      );
      let duration: number = performance.now() - s;
      duration = parseFloat((duration / 1000).toFixed(2));

      if (!result || result.length === 0) {
        this.loggerService.logError(
          `No statistics found for season: ${seasonId}`,
          'team/statistics/score-of-period/:seasonId',
          'GET',
          404,
          LoggerModule.TEAM,
          duration
        );
        return response.status(404).send({
          message: 'No statistics found for this season!',
          status: 404,
          data: [],
        });
      }
      this.loggerService.logInfo(
        `Statistics retieved successfully for season: ${seasonId}`,
        'team/statistics/score-of-period/:seasonId',
        'GET',
        500,
        LoggerModule.TEAM,
        duration
      );

      return response.status(200).send({
        message: 'Scoring periods of teams retrieved successfully',
        status: 200,
        data: result,
      });
    } catch (error) {
      let duration: number = performance.now() - s;
      duration = parseFloat((duration / 1000).toFixed(2));
      this.loggerService.logError(
        `Server Error happened while finding statistics for season: ${seasonId}`,
        'team/statistics/score-of-period/:seasonId',
        'GET',
        500,
        LoggerModule.TEAM,
        duration,
        error,
      );
      return response.status(500).send({
        message: 'Server Error happened',
        status: 500,
        data: [],
      });
    }
  }

  @Get('statistics/conceded-of-period/:seasonId/:period')
  async getMostScoredAtOfPeriod(
    @Param(
      'seasonId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    seasonId: number,
    @Param(
      'period',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    period: number,
    @Res() response: Response,
  ) {
    const s: number = performance.now();
    try {
      const result = await this.teamService.getMostScoredAtOfPeriod(
        seasonId,
        period,
      );
      let duration: number = performance.now() - s;
      duration = parseFloat((duration / 1000).toFixed(2));

      if (!result || result.length === 0) {
        this.loggerService.logError(
          `No statistics found for season: ${seasonId}`,
          'team/statistics/conceded-of-period/:seasonId',
          'GET',
          404,
          LoggerModule.TEAM,
          duration
        );
        return response.status(404).send({
          message: 'No statistics found for this season!',
          status: 404,
          data: [],
        });
      }
      this.loggerService.logInfo(
        `Statistics retieved successfully for season: ${seasonId}`,
        'team/statistics/conceded-of-period/:seasonId',
        'GET',
        200,
        LoggerModule.TEAM,
        duration
      );

      return response.status(200).send({
        message: 'Goals conceded periods of teams retrieved successfully',
        status: 200,
        data: result,
      });
    } catch (error) {
      let duration: number = performance.now() - s;
      duration = parseFloat((duration / 1000).toFixed(2));
      this.loggerService.logError(
        `Server Error happened while finding statistics for season: ${seasonId}`,
        'team/statistics/conceded-of-period/:seasonId',
        'GET',
        500,
        LoggerModule.TEAM,
        duration,
        error,
      );
      return response.status(500).send({
        message: 'Server Error happened',
        status: 500,
        data: [],
      });
    }
  }
}
