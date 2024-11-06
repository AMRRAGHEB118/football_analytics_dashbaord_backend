import { Module, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PlayerModule } from './player/player.module';
import { AxiosModule } from './services/axios/axios.module';
import { DataMapModule } from './services/datamap/data-map.module';
import { ContactUsModule } from './contact_us/contact_us.module';
import { APP_PIPE } from '@nestjs/core';
import { TeamModule } from './team/team.module';
import { SeasonModule } from './season/season.module';
import { LeagueModule } from './league/league.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    AxiosModule,
    PlayerModule,
    DataMapModule,
    ContactUsModule,
    TeamModule,
    SeasonModule,
    LeagueModule
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
