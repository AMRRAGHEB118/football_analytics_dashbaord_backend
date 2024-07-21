import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ThirdPartyFetch {
  constructor (private readonly httpService: HttpService) {}

  async fetchTeam (id: number, season: number) {
    const baseUrl = `https://api.sportmonks.com/v3/football/teams/${id}?include=players;statistics.details.type
    &api_token=${process.env.API_KEY}&filters=teamstatisticSeasons:${season}`

    let team = await firstValueFrom(this.httpService.get(baseUrl)
                .pipe(map(res => res.data)));

    if (!team) throw new HttpException('Team Not Found!', HttpStatus.NOT_FOUND);

    return team;
  }
}