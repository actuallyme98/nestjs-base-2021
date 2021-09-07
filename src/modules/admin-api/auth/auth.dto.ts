import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

import { AuthValidatorEnums } from './auth.enum';

export class SignUpDTO {
  @ApiProperty()
  @MaxLength(60, { message: AuthValidatorEnums.USERNAME_MAXLENGTH_MESSAGE })
  @IsNotEmpty({ message: AuthValidatorEnums.REQUIRED_MESSAGE })
  username: string;

  @ApiProperty()
  @MinLength(8, { message: AuthValidatorEnums.PASSWORD_MINLENGTH_MESSAGE })
  @MaxLength(60, { message: AuthValidatorEnums.PASSWORD_MAXLENGTH_MESSAGE })
  @IsNotEmpty({ message: AuthValidatorEnums.REQUIRED_MESSAGE })
  password: string;

  @ApiProperty()
  @MaxLength(180, { message: AuthValidatorEnums.FULLNAME_MAXLENGTH_MESSAGE })
  @IsNotEmpty({ message: AuthValidatorEnums.REQUIRED_MESSAGE })
  fullName: string;

  @ApiProperty()
  @IsOptional()
  @MaxLength(15, { message: AuthValidatorEnums.PHONE_MAXLENGTH_MESSAGE })
  @IsNotEmpty({ message: AuthValidatorEnums.REQUIRED_MESSAGE })
  phone: string;
}

export class AuthValidateDTO {
  @ApiProperty()
  @IsNotEmpty({ message: AuthValidatorEnums.REQUIRED_MESSAGE })
  username: string;

  @ApiProperty()
  @IsNotEmpty({ message: AuthValidatorEnums.REQUIRED_MESSAGE })
  password: string;
}

export class AuthResponseDTO {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class AuthRefreshTokenDTO {
  @ApiProperty()
  @IsNotEmpty({ message: AuthValidatorEnums.REQUIRED_MESSAGE })
  refreshToken: string;
}
