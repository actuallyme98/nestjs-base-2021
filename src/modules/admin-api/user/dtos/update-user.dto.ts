import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

import { UserValidatorEnums } from '../user.enum';
import { UserDTO } from './user.dto';

export class UpdateUserDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(8, { message: UserValidatorEnums.PASSWORD_MINLENGTH_MESSAGE })
  @MaxLength(60, { message: UserValidatorEnums.PASSWORD_MAXLENGTH_MESSAGE })
  @IsNotEmpty({ message: UserValidatorEnums.REQUIRED_MESSAGE })
  password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(180, { message: UserValidatorEnums.FULLNAME_MAXLENGTH_MESSAGE })
  @IsNotEmpty({ message: UserValidatorEnums.REQUIRED_MESSAGE })
  fullName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(15, { message: UserValidatorEnums.PHONE_MAXLENGTH_MESSAGE })
  @IsNotEmpty({ message: UserValidatorEnums.REQUIRED_MESSAGE })
  phone?: string;
}

export class UpdateUserResponseDTO extends UserDTO {}
