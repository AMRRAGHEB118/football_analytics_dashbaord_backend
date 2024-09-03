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
    );
  }

  async logError(
    message: string,
    endpoint: string,
    method: string,
    statusCode: number,
    module: LoggerModule,
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
    });
    return logEntry.save();
  }
}
