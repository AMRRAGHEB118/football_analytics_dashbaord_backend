import { Controller, Get, Res } from '@nestjs/common';
import { SeasonService } from './season.service';
import { Response } from 'express';
import { LoggerService } from 'src/services/logger/logger.service';
import { LoggerModule } from 'src/services/logger/logger.schema';


@Controller('seasons')
export class SeasonController {
  constructor(private seasonService: SeasonService,
    private readonly loggerService: LoggerService
  ) { }

  @Get('/fetch')
  async fetchSeasons(@Res() response: Response) {
    const result = await this.seasonService.fetchSeasons();
    
    if (result.status_code == 200) {
      this.loggerService.logInfo
        (
          "Seasons fetched successfully",
          "seasons/fetch", "GET", 200, LoggerModule.SEASON
        );
      return response.status(200)
        .send
        ({
          "message": "Seasons retrieved successfully",
          "status_code": 200,
          "data": result.data,
        });
    };
    this.loggerService.logError
      (
        "Error fetching seasons",
        "seasons/fetch", "GET", 500, LoggerModule.SEASON
      );
    return response.status(500)
      .send
      ({
        "message": "Error happened, please try again later",
        "status_code": 500,
        "data": [],
      });
  }
}
