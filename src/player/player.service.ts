import { Injectable } from '@nestjs/common';

@Injectable()
export class PlayerService {
  findAll() {
    return `This action returns all player`;
  }

  findOne(id: number) {
    return `This action returns a #${id} player`;
  }
}
