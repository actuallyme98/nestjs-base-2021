import { HttpException, HttpStatus } from '@nestjs/common';

export class ConfigurationError extends HttpException {
  constructor(
    response: string | Record<string, any> = 'Configuration Error',
    status: number = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(response, status);
  }
}
