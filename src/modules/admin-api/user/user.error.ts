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

export class UserAlreadyExistsError extends HttpException {
  constructor(
    response: string | Record<string, any> = UserErrorEnums.ALREADY_EXIST,
    status: number = HttpStatus.BAD_REQUEST,
  ) {
    super(response, status);
  }
}

export class UserDoesNotHavePermissionError extends HttpException {
  constructor(
    response: string | Record<string, any> = UserErrorEnums.DONT_HAVE_PERMISSION,
    status: number = HttpStatus.FORBIDDEN,
  ) {
    super(response, status);
  }
}

export class DeleteYourselfError extends HttpException {
  constructor(
    response: string | Record<string, any> = UserErrorEnums.CANNOT_DELETE_YOURSELF,
    status: number = HttpStatus.FORBIDDEN,
  ) {
    super(response, status);
  }
}
