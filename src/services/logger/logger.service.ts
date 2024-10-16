import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  LoggerDocument,
  Logger,
  LoggerType,
  LoggerModule,
} from './logger.schema';

@Injectable()
export class LoggerService {
  constructor(
    @InjectModel(Logger.name)
    private readonly loggerModel: Model<LoggerDocument>,
  ) {}

  async logInfo(
    message: string,
    endpoint: string,
    method: string,
    statusCode: number,
    module: LoggerModule,
    responseTime?: number,
    errorDetails?: string,
    options?: Partial<Logger>,
    metadata?: Record<string, any>,
    isAutomated?: boolean,
    ipAddress?: string,
  ): Promise<Logger> {
    return this.createLog(
      message,
      endpoint,
      method,
      statusCode,
      module,
      LoggerType.INFO,
      errorDetails,
      options,
      metadata,
      isAutomated,
      ipAddress,
      responseTime
    );
  }

  async logError(
    message: string,
    endpoint: string,
    method: string,
    statusCode: number,
    module: LoggerModule,
    responseTime?: number,
    errorDetails?: string,
    options?: Partial<Logger>,
    metadata?: Record<string, any>,
    isAutomated?: boolean,
    ipAddress?: string,
  ): Promise<Logger> {
    return this.createLog(
      message,
      endpoint,
      method,
      statusCode,
      module,
      LoggerType.ERROR,
      errorDetails,
      options,
      metadata,
      isAutomated,
      ipAddress,
      responseTime
    );
  }

  private async createLog(
    message: string,
    endpoint: string,
    method: string,
    statusCode: number,
    module: LoggerModule,
    type: LoggerType = LoggerType.INFO,
    errorDetails?: string,
    options?: Partial<Logger>,
    metadata?: Record<string, any>,
    isAutomated?: boolean,
    ipAddress?: string,
    responseTime?: number,
  ): Promise<Logger> {
    const logEntry = new this.loggerModel({
      message,
      endpoint,
      method,
      statusCode,
      module,
      type,
      errorDetails,
      ...options,
      metadata,
      isAutomated,
      ipAddress,
      responseTime
    });
    return logEntry.save();
  }
}
