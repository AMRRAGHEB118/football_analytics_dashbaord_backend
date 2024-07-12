import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PlayerModule } from './player/player.module';
import { AxiosModule } from './services/axios/axios.module';
import { DataMapModule } from './services/datamap/data-map.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    AxiosModule,
    PlayerModule,
    DataMapModule,
  ],
})
export class AppModule {}
