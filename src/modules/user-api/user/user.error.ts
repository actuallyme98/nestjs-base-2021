import { HttpException, HttpStatus } from '@nestjs/common';
import { UserErrorEnums } from './user.enum';

export class UserDoesNotExistError extends HttpException {
  constructor(
    response: string | Record<string, any> = UserErrorEnums.NOT_EXIST,
    status: number = HttpStatus.BAD_REQUEST,
  ) {
    super(response, status);
  }
}
