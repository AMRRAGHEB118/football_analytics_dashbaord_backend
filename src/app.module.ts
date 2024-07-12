import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PlayerModule } from './player/player.module';
import { AxiosModule } from './services/axios/axios.module';
import { DataMapModule } from './services/datamap/data-map.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    AxiosModule,
    PlayerModule,
    DataMapModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
