import { Controller, Get, Res } from '@nestjs/common';
import { LeagueService } from './league.service';
import { Response } from 'express';
import { LoggerService } from 'src/services/logger/logger.service';
import { LoggerModule } from 'src/services/logger/logger.schema';

@Controller('league')
export class LeagueController {
  constructor(
    private readonly leagueService: LeagueService,
    private readonly loggerService: LoggerService,
  ) {}

  @Get()
  async listLeagues(@Res() response: Response) {
    const s: number = performance.now();
    try {
      const result = await this.leagueService.listLeagues();
      let duration: number = performance.now() - s;
      duration = parseFloat(duration.toFixed(2));

      if (!result) {
        this.loggerService.logError(
          'No leagues found',
          '/league',
          'GET',
          404,
          LoggerModule.LEAGUE,
          duration,
        );
        return response.status(404).send({
          message: 'No leagues found',
          status_code: 404,
          data: [],
        });
      }

      this.loggerService.logInfo(
        'Leagues retrieved successfully',
        '/league',
        'GET',
        200,
        LoggerModule.LEAGUE,
        duration,
      );
      return response.status(200).send({
        message: 'leagues retrieved successfully',
        status_code: 200,
        data: result
      });
    } catch (err) {
      let duration: number = performance.now() - s;
      duration = parseFloat(duration.toFixed(2));
      this.loggerService.logError(
        `Failed to retrieve leagues`,
        '/league',
        'GET',
        500,
        LoggerModule.LEAGUE,
        duration,
        err,
      );
      return response.status(500).send({
        message: 'Server Error happened',
        status_code: 500,
        data: [],
      });
    }
  }
}
