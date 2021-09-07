import { HttpException, HttpStatus } from '@nestjs/common';

import { AuthErrorEnums } from './auth.enum';

export class IncorrectPasswordError extends HttpException {
  constructor(
    response: string | Record<string, any> = AuthErrorEnums.INCORRECT_PASSWORD,
    status: number = HttpStatus.BAD_REQUEST,
  ) {
    super(response, status);
  }
}
