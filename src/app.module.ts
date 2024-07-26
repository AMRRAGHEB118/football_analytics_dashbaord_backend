import { Module, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PlayerModule } from './player/player.module';
import { AxiosModule } from './services/axios/axios.module';
import { DataMapModule } from './services/datamap/data-map.module';
import { ContactUsModule } from './contact_us/contact_us.module';
import { APP_PIPE } from '@nestjs/core';

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
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
