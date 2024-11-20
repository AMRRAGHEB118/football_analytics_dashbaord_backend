import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AxiosService } from './services/axios/axios.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private readonly axiosService: AxiosService) {}
  onApplicationBootstrap() {
    try {
        this.axiosService.instance.post(
          `${process.env.SERVER_URL}/auth/create-admin`,
        );
    } catch (error) {
        console.log(error);
    }
  }
}
