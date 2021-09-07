import { SortingOptions } from '@common/interfaces/sort.interface';
import { UserRoleEnums } from '@db/entities';
import { UserSortByEnums } from './user.enum';

export interface CreateUserInput {
  userId: string;
  username: string;
  password: string;
  fullName: string;
  phone: string;
  role: UserRoleEnums;
}

export interface UpdateUserInput {
  userId: string;
  toUpdateUserId: string;
  password?: string;
  fullName?: string;
  phone?: string;
}

export type UserSortingOptions = SortingOptions<UserSortByEnums>;

export interface UserFilteringOptions {
  fullName?: string;
  username?: string;
  phone?: string;
  createdUserName?: string;
  role?: UserRoleEnums;
}
