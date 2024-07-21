import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './schema/team.schema';
import { HttpModule} from '@nestjs/axios';
import { ThirdPartyFetch } from './3rdPartyFetch/3rdPartyFetch.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
  HttpModule],
  providers: [TeamService, ThirdPartyFetch],
  controllers: [TeamController]
})
export class TeamModule {}
