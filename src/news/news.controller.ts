import { Controller, Get, NotImplementedException, Res } from '@nestjs/common';
import { NewsService } from './news.service';
import { LoggerService } from 'src/services/logger/logger.service';
import { Response } from 'express';
import { LoggerModule } from 'src/services/logger/logger.schema';
import { resObj } from 'src/types';

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly loggerService: LoggerService,
  ) {}

  @Get('scrap-news')
  async scrapNews(@Res() res: Response) {
    const s: number = performance.now();
    try {
      await this.newsService.scrapNews();
      let duration: number = performance.now() - s;
      duration = parseFloat((duration / 1000).toFixed(2));
      this.loggerService.logInfo(
        'News scrapped successfully',
        'news/scrap-news',
        'GET',
        201,
        LoggerModule.NEWS,
        duration,
      )
      return res
        .status(201)
        .send(resObj('News updated successfully', 201, []));
    } catch (error) {
      let duration: number = performance.now() - s;
      duration = parseFloat((duration / 1000).toFixed(2));
      this.loggerService.logError(
        'Error happened while retrieving news',
        'news/scrap-news',
        'GET',
        500,
        LoggerModule.NEWS,
        duration,
        error,
      );
      return res
        .status(500)
        .send(resObj('Error happened while retrieving news', 500, []));
    }
  }

  @Get('get-news')
  getNews() {
    throw new NotImplementedException('To be implemented after finishing the design')
  }
}
