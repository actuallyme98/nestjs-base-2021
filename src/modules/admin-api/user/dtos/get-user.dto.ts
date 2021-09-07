import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

import { OrderByEnum } from '@common/enums/sorting.enum';
import { UserRoleEnums } from '@db/entities';

import { PaginationDTO } from '@common/dtos/pagination.dto';
import { UserSortByEnums } from '../user.enum';
import { UserDTO } from './user.dto';

export class GetUsersQueryDTO {
  @ApiPropertyOptional({ type: Number, default: 1 })
  @Type(() => Number)
  @IsOptional()
  readonly page: number = 1;

  @ApiPropertyOptional({ type: Number, default: 10 })
  @Type(() => Number)
  @IsOptional()
  readonly limit: number = 10;

  @ApiPropertyOptional({
    enum: UserSortByEnums,
    default: UserSortByEnums.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(UserSortByEnums)
  readonly sortBy: UserSortByEnums = UserSortByEnums.CREATED_AT;

  @ApiPropertyOptional({
    enum: OrderByEnum,
    default: OrderByEnum.DESC,
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  readonly orderBy: OrderByEnum = OrderByEnum.DESC;

  @ApiPropertyOptional({ enum: UserRoleEnums })
  @IsOptional()
  readonly role: UserRoleEnums;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly fullName?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly username?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly phone?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly createdUserName?: string;
}

export class UserSortingDTO {
  @ApiProperty({ enum: UserSortByEnums })
  sortBy: UserSortByEnums;

  @ApiProperty({ enum: OrderByEnum })
  orderBy: OrderByEnum;
}

export class UserFilteringDTO {
  @ApiPropertyOptional()
  fullName?: string;

  @ApiPropertyOptional()
  username?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  createdUserName?: string;

  @ApiPropertyOptional({ enum: UserRoleEnums })
  role?: UserRoleEnums;
}

export class GetUsersResponseDTO {
  @ApiProperty({ type: PaginationDTO })
  pagination: PaginationDTO;

  @ApiProperty({ isArray: true, type: UserDTO })
  items: UserDTO[];

  @ApiProperty({ type: UserSortingDTO })
  sorting: UserSortingDTO;

  @ApiProperty({ type: UserFilteringDTO })
  filtering: UserFilteringDTO;
}
