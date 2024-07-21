import { Injectable } from '@nestjs/common';
import { Team } from './schema/team.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ThirdPartyFetch } from './3rdPartyFetch/3rdPartyFetch.service';


@Injectable()
export class TeamService {
    constructor(@InjectModel(Team.name) private teamModel: Model<Team>,
                private thirdParty: ThirdPartyFetch) {}

    async findOne(id: number, season: number): Promise<Team> {
        let team = await this.teamModel.findOne({ id }).populate('statistics');
        
        if (!team) {
            return this.thirdParty.fetchTeam(id, season)
        }
        return team;
    }

}
