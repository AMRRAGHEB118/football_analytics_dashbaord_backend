import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class AxiosService {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.FOOTBALL_API,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  get instance(): AxiosInstance {
    return this.axiosInstance;
  }
}
