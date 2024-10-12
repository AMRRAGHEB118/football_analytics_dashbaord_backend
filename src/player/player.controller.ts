import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { PlayerService } from './player.service';
import { Response } from 'express';
import { LoggerService } from 'src/services/logger/logger.service';
import { LoggerModule } from 'src/services/logger/logger.schema';



@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService,
    private readonly loggerService: LoggerService
  ) { }

  @Get()
  async findAll(@Res() response: Response) {
    const result = await this.playerService.findAll();

    if (result.status_code === 200) {
      this.loggerService.logInfo
        (
          'Players fetched successfully from third party',
          '/players', 'GET', 200, LoggerModule.PLAYER
        );
      return response.status(200)
        .send({
          "message": "Players fetched successfully",
          "status_code": 200,
          "data": []
        });
    }
    if (result.status_code === 404) {
      this.loggerService.logError
        (
          'No players found to fetch',
          '/players', 'GET', 404, LoggerModule.PLAYER
        );
      return response.status(404)
        .send({
          "message": "No players found",
          "status_code": 404,
          "data": []
        });
    }

    this.loggerService.logError
      (
        `Failed to fetch players from third party`,
        '/players', 'GET', 500, LoggerModule.PLAYER, result.err
      );
    return response.status(500)
      .send({
        "message": "Server Error happened",
        "status_code": 500,
        "data": []
      })

  }

  @Get(':id')
  async findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Res() response: Response
  ) {

    try {
      const result = await this.playerService.findOne(id);

      if (result.status_code == 200) {
        this.loggerService.logInfo
          (
            `Found player ${id} successfully`,
            "player/:id", "GET", 200, LoggerModule.PLAYER
          );
        return response.status(200)
          .send
          (
            {
              "message": "Player found successfully.",
              "status_code": 200,
              "data": [result.data]
            }
          );
      }
      if (result.status_code == 404) {
        this.loggerService.logError
          (
            `Can't find player ${id}`,
            "player/:id", "GET", 404, LoggerModule.PLAYER
          );
        return response.status(404)
          .send
          (
            {
              "message": `Player ${id} not found, please make sure of the id`,
              "status_code": 404,
              "data": []
            }
          );
      }
      console.log(result);
      throw new HttpException(result.msg, 500)
    } catch (error) {
      this.loggerService.logError
        (
          `Server error happened while finding player ${id}`,
          "player/:id", "GET", 500, LoggerModule.PLAYER, error
        );
      return response.status(500)
        .send
        (
          {
            "message": `Server error happened while finding player ${id}`,
            "status_code": 500,
            "data": []
          }
        );
    }
  }

  @Get('statistics/top-score/:seasonId')
  async getTopScorerOfSeason(
    @Param(
      'seasonId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    seasonId: number,
    @Res() response: Response
  ) {
    try {
      const result = await this.playerService.getTopScorerOfSeason(seasonId);
      if (result.length === 0) {
        this.loggerService.logError
          (
            `No statistics found for season: ${seasonId}`,
            '/players/statistics/top-score/:seasonId',
            "GET", 404, LoggerModule.PLAYER
          )
        return response.status(404)
          .send({
            message: "No statistics found for this season",
            status_code: 404,
            data: []
          })
      }

      this.loggerService.logInfo
        (
          `Top scorers retrieved successfully for season: ${seasonId}`,
          '/players/statistics/top-score/:seasonId',
          "GET", 200, LoggerModule.PLAYER
        )
      return response.status(200)
        .send({
          message: "Top scorers retrieved successfully",
          status_code: 200,
          data: result
        });

    } catch (error) {
      this.loggerService.logError
        (
          `Error happened for season: ${seasonId}`,
          '/players/statistics/top-score/:seasonId',
          "GET", 500, LoggerModule.PLAYER, error
        )
      return response.status(500)
        .send({
          message: "Server error happened",
          status_code: 500,
          data: []
        })
    }

  }

  @Get('statistics/top-assist/:seasonId')
  async getTopAssistantOfSeason(
    @Param(
      'seasonId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    seasonId: number,
    @Res() response: Response
  ) {
    try {
      const result = await this.playerService.getTopAssistantOfSeason(seasonId);
      if (result.length === 0) {
        this.loggerService.logError
          (
            `No statistics found for season: ${seasonId}`,
            '/players/statistics/top-assist/:seasonId',
            "GET", 404, LoggerModule.PLAYER
          )
        return response.status(404)
          .send({
            message: "No statistics found for this season",
            status_code: 404,
            data: []
          })
      }

      this.loggerService.logInfo
        (
          `Top assistants retrieved successfully for season: ${seasonId}`,
          '/players/statistics/top-assist/:seasonId',
          "GET", 200, LoggerModule.PLAYER
        )
      return response.status(200)
        .send({
          message: "Top assistant retrieved successfully",
          status_code: 200,
          data: result
        });

    } catch (error) {
      this.loggerService.logError
        (
          `Error happened for season: ${seasonId}`,
          '/players/statistics/top-assist/:seasonId',
          "GET", 500, LoggerModule.PLAYER, error
        )
      return response.status(500)
        .send({
          message: "Server error happened",
          status_code: 500,
          data: []
        })
    }
  }

  @Get('statistics/top-yellow-card/:seasonId')
  async getTopYellowCardOfSeason(
    @Param(
      'seasonId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    seasonId: number,
    @Res() response: Response
  ) {
    try {
      const result = await this.playerService.getTopYellowCard(seasonId);
      if (result.length === 0) {
        this.loggerService.logError
          (
            `No statistics found for season: ${seasonId}`,
            '/players/statistics/top-yellow-card/:seasonId',
            "GET", 404, LoggerModule.PLAYER
          )
        return response.status(404)
          .send({
            message: "No statistics found for this season",
            status_code: 404,
            data: []
          })
      }

      this.loggerService.logInfo
        (
          `Top yellow cards retrieved successfully for season: ${seasonId}`,
          '/players/statistics/top-yellow-card/:seasonId',
          "GET", 200, LoggerModule.PLAYER
        )
      return response.status(200)
        .send({
          message: "Top yellow carded players retrieved successfully",
          status_code: 200,
          data: result
        });

    } catch (error) {
      this.loggerService.logError
        (
          `Error happened for season: ${seasonId}`,
          '/players/statistics/top-yellow-card/:seasonId',
          "GET", 500, LoggerModule.PLAYER, error
        )
      return response.status(500)
        .send({
          message: "Server error happened",
          status_code: 500,
          data: []
        })
    }
  }
  
  @Get('statistics/top-contributions/:seasonId')
  async getTopRedCardOfSeason(
    @Param(
      'seasonId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    seasonId: number,
    @Res() response: Response
  ) {
    try {
      const result = await this.playerService.getTopContributions(seasonId);
      if (result.length === 0) {
        this.loggerService.logError
          (
            `No statistics found for season: ${seasonId}`,
            '/players/statistics/top-contributions/:seasonId',
            "GET", 404, LoggerModule.PLAYER
          )
        return response.status(404)
          .send({
            message: "No statistics found for this season",
            status_code: 404,
            data: []
          })
      }

      this.loggerService.logInfo
        (
          `Top contributed successfully for season: ${seasonId}`,
          '/players/statistics/top-contributions/:seasonId',
          "GET", 200, LoggerModule.PLAYER
        )
      return response.status(200)
        .send({
          message: "Top contributed players retrieved successfully",
          status_code: 200,
          data: result
        });

    } catch (error) {
      this.loggerService.logError
        (
          `Error happened for season: ${seasonId}`,
          '/players/statistics/top-contributions/:seasonId',
          "GET", 500, LoggerModule.PLAYER, error
        )
      return response.status(500)
        .send({
          message: "Server error happened",
          status_code: 500,
          data: []
        })
    }
  }

}
