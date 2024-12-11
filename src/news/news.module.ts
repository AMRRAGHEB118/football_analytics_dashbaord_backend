import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { News, NewsSchema } from './schema/news.schema';
import { LoggerModule } from 'src/services/logger/logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
    LoggerModule,
  ],
  providers: [NewsService],
  controllers: [NewsController],
})
export class NewsModule {}
