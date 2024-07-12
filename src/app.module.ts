import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AxiosModule } from './services/axios/axios.module';
import { PlayerModule } from './player/player.module';
import { DataMapService } from './services/datamap/data-map.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    AxiosModule,
    PlayerModule,
  ],
  controllers: [AppController],
  providers: [AppService, DataMapService],
})
export class AppModule {}
