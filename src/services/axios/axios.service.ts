import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class AxiosService {
  private readonly axiosInstance: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.axiosInstance = axios.create({
      baseURL: this.configService.get<string>('FOOTBALL_API'),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  get instance(): AxiosInstance {
    return this.axiosInstance;
  }
}
