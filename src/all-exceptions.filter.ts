import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

type PrismaError = Error & {
  code?: string;
  meta?: Record<string, unknown>;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Internal Server Error';

    // -------------------------
    // NestJS Exceptions
    // -------------------------
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message = exception.getResponse();
    }

    // -------------------------
    // Prisma Errors
    // -------------------------
    else if (exception instanceof Error) {
      const prismaError = exception as PrismaError;

      switch (prismaError.code) {
        // Unique constraint failed
        case 'P2002':
          statusCode = HttpStatus.CONFLICT;
          message = {
            message: 'A record with this value already exists.',
            target: prismaError.meta?.target,
          };
          break;

        // Record not found
        case 'P2025':
          statusCode = HttpStatus.NOT_FOUND;
          message = 'Record not found.';
          break;

        // Foreign key constraint
        case 'P2003':
          statusCode = HttpStatus.BAD_REQUEST;
          message = 'Foreign key constraint failed.';
          break;

        // Required record does not exist
        case 'P2015':
          statusCode = HttpStatus.NOT_FOUND;
          message = 'Related record not found.';
          break;

        // Invalid ID
        case 'P2023':
          statusCode = HttpStatus.BAD_REQUEST;
          message = 'Invalid ID provided.';
          break;

        default: {
          // Prisma validation errors don't expose a code
          if (
            prismaError.name === 'PrismaClientValidationError' ||
            prismaError.message.includes('Invalid `prisma.')
          ) {
            statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
            message = prismaError.message.replace(/\n/g, ' ');
          }

          // Prisma initialization errors
          else if (prismaError.name === 'PrismaClientInitializationError') {
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Database initialization failed.';
          }

          // Prisma engine panic
          else if (prismaError.name === 'PrismaClientRustPanicError') {
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Database engine crashed.';
          }

          // Unknown Prisma error
          else if (prismaError.name === 'PrismaClientUnknownRequestError') {
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Unknown database error.';
          }

          // Any other Error
          else {
            message = prismaError.message;
          }
        }
      }
    }

    this.logger.error(
      `[${request.method}] ${request.originalUrl}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(statusCode).json({
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
      method: request.method,
      message,
    });
  }
}
