import { ApiProperty } from '@nestjs/swagger';

import { SoftDeleteAbstractDTO } from '@common/dtos/soft-delete-abstract.dto';
import { UserEntity, UserRoleEnums } from '@db/entities';

interface UserDTOOptions {
  includeSt?: boolean;
}

export class UserDTO extends SoftDeleteAbstractDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({ enum: UserRoleEnums })
  role: UserRoleEnums;

  constructor(user: UserEntity, options?: UserDTOOptions) {
    const {} = options || {};

    super(user);
    this.id = user.id;
    this.username = user.username;
    this.fullName = user.fullName;
    this.phone = user.phone;
    this.role = user.role;
  }
}
