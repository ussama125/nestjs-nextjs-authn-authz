import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { Response } from 'express';
import { MongoError } from 'mongodb';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    this.logger.log('Exception: ', exception);
    this.logger.log('Stack: ', exception.stack);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'ERR_MONGO';
    let message = 'An error occurred';

    if (exception instanceof HttpException) {
      this.logger.log('Error: ', exception.getResponse());
      const response: any = exception.getResponse();
      statusCode = exception.getStatus();
      errorCode = exception.name;
      message =
        typeof response === 'object' ? response.message : exception.message;
    } else if (exception instanceof MongoError) {
      if (exception.code === 11000) {
        // Duplicate key error
        statusCode = HttpStatus.BAD_REQUEST;
        errorCode = 'ERR_DUPLICATE_KEY';
        message = `${getDuplicateKeyField(exception).toUpperCase()} already exists`;
      } else if (exception.code === 121) {
        // Object ID cast error
        statusCode = HttpStatus.BAD_REQUEST;
        errorCode = 'ERR_INVALID_ID';
        message = 'Invalid object ID';
      }
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      errorCode = 'INTERNAL_SERVER_ERROR';
      message = exception.message || 'Internal Server Error';
    }

    response.status(statusCode).json({
      statusCode,
      errorCode,
      message,
    });
  }
}

const getDuplicateKeyField = (exception: MongoError): string => {
  const errorMessage = exception.errmsg || '';
  const match = errorMessage.match(/index:\s(.+?)_1/);
  if (match && match[1]) {
    return match[1];
  }
  return 'Unknown field';
};
