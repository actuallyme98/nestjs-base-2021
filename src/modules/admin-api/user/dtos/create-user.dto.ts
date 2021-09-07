import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { UserRoleEnums } from '@db/entities';

import { UserValidatorEnums } from '../user.enum';
import { UserDTO } from './user.dto';

export class CreateUserDTO {
  @ApiProperty()
  @MaxLength(60, { message: UserValidatorEnums.USERNAME_MAXLENGTH_MESSAGE })
  @IsNotEmpty({ message: UserValidatorEnums.REQUIRED_MESSAGE })
  username: string;

  @ApiProperty()
  @MinLength(8, { message: UserValidatorEnums.PASSWORD_MINLENGTH_MESSAGE })
  @MaxLength(60, { message: UserValidatorEnums.PASSWORD_MAXLENGTH_MESSAGE })
  @IsNotEmpty({ message: UserValidatorEnums.REQUIRED_MESSAGE })
  password: string;

  @ApiProperty()
  @MaxLength(180, { message: UserValidatorEnums.FULLNAME_MAXLENGTH_MESSAGE })
  @IsNotEmpty({ message: UserValidatorEnums.REQUIRED_MESSAGE })
  fullName: string;

  @ApiProperty()
  @IsOptional()
  @MaxLength(15, { message: UserValidatorEnums.PHONE_MAXLENGTH_MESSAGE })
  @IsNotEmpty({ message: UserValidatorEnums.REQUIRED_MESSAGE })
  phone: string;

  @ApiProperty({ enum: UserRoleEnums })
  @IsNotEmpty()
  @IsEnum(UserRoleEnums)
  role: UserRoleEnums;
}

export class CreateUserResponseDTO extends UserDTO {}
