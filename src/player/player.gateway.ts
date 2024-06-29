// import {
//   WebSocketGateway,
//   SubscribeMessage,
//   MessageBody,
// } from '@nestjs/websockets';
// import { PlayerService } from './player.service';

// @WebSocketGateway()
// export class PlayerGateway {
//   constructor(private readonly playerService: PlayerService) {}

//   @SubscribeMessage('findAllPlayer')
//   findAll(@MessageBody () teamId: number) {
//     return this.playerService.findAll();
//   }

//   @SubscribeMessage('findOnePlayer')
//   findOne(@MessageBody() id: number) {
//     return this.playerService.findOne(id);
//   }
// }
