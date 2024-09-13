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
}
