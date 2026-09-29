import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import {
  EmailAlreadyInUseError,
  UserError,
} from '../../domain/errors/user.errors.js';
import type { Response } from 'express';

@Catch(UserError)
export class UserExceptionFilter implements ExceptionFilter {
  catch(exception: UserError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status =
      exception instanceof EmailAlreadyInUseError
        ? HttpStatus.CONFLICT
        : HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      error: exception.name,
      message: exception.message,
    });
  }
}
