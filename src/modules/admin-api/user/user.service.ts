import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';
// entities
import { UserEntity, UserRoleEnums } from '@db/entities';
// DTO
import { UserDTO } from './dtos/user.dto';
import { GetUsersResponseDTO } from './dtos/get-user.dto';
// interfaces
import {
  CreateUserInput,
  UpdateUserInput,
  UserFilteringOptions,
  UserSortingOptions,
} from './user.interface';
// errors
import {
  UserAlreadyExistsError,
  UserDoesNotExistError,
  UserDoesNotHavePermissionError,
  DeleteYourselfError,
} from './user.error';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getMe(userId: string): Promise<UserDTO> {
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new UserDoesNotExistError();
    }

    return new UserDTO(user, {});
  }

  async createOne(input: CreateUserInput): Promise<UserDTO> {
    const { userId, ...payload } = input;
    const currentUser = await this.userRepository.findOne(userId);
    if (!currentUser) {
      throw new UserDoesNotExistError();
    }

    // Cannot create super admin
    if (payload.role === UserRoleEnums.SUPER_ADMIN) {
      throw new UserDoesNotHavePermissionError();
    }

    // Admin cannot create admin
    if (currentUser.role === UserRoleEnums.ADMIN && payload.role === UserRoleEnums.ADMIN) {
      throw new UserDoesNotHavePermissionError();
    }

    // Customer cannot create new user
    if (currentUser.role === UserRoleEnums.CUSTOMER) {
      throw new UserDoesNotHavePermissionError();
    }

    // Employee can only create customer
    if (currentUser.role === UserRoleEnums.EMPLOYEE && payload.role !== UserRoleEnums.CUSTOMER) {
      throw new UserDoesNotHavePermissionError();
    }

    const user = await this.userRepository.findOne(
      { username: payload.username },
      { withDeleted: true },
    );
    if (user) {
      throw new UserAlreadyExistsError();
    }

    const newUser = await new UserEntity({
      ...payload,
      password: await UserEntity.hashPassword(payload.password),
      createdUser: currentUser,
    }).save();

    return new UserDTO(newUser, {});
  }

  async getMany(
    userId: string,
    paginationOptions: IPaginationOptions,
    sortingOptions: UserSortingOptions,
    filteringOptions: UserFilteringOptions,
  ): Promise<GetUsersResponseDTO> {
    const { sortBy, orderBy } = sortingOptions;
    const { role, fullName, username, phone, createdUserName } = filteringOptions;
    const currentUser = await this.userRepository.findOne(userId);
    if (!currentUser) {
      throw new UserDoesNotExistError();
    }

    if (currentUser.role === UserRoleEnums.CUSTOMER) {
      throw new UserDoesNotHavePermissionError();
    }

    const queryBuilder = this.userRepository
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.createdUser', 'createdUser');

    if (currentUser.role === UserRoleEnums.EMPLOYEE) {
      queryBuilder.andWhere(
        new Brackets((subQueryBuilder) => {
          subQueryBuilder.where('u.id = :id', { id: currentUser.id });
          subQueryBuilder.orWhere('createdUser.id = :id', { id: userId });
        }),
      );
    }

    if (fullName && fullName.length > 0) {
      queryBuilder.andWhere('u.fullName like :fullName', { fullName: `%${fullName}%` });
    }

    if (username && username.length > 0) {
      queryBuilder.andWhere('u.username like :username', { username: `%${username}%` });
    }

    if (phone && phone.length > 0) {
      queryBuilder.andWhere('u.phone like :phone', { phone: `%${phone}%` });
    }

    if (createdUserName && createdUserName.length > 0) {
      queryBuilder.andWhere('createdUser.fullName like :createdUserName', {
        createdUserName: `%${createdUserName}%`,
      });
    }

    if (role) {
      queryBuilder.andWhere('u.role = :role', { role });
    }

    queryBuilder.orderBy(`u.${sortBy}`, orderBy);

    const records = await paginate<UserEntity>(queryBuilder, paginationOptions);
    const items: UserDTO[] = records.items.map((item) => ({
      ...new UserDTO(item, {}),
    }));

    return {
      items,
      pagination: records.meta,
      sorting: sortingOptions,
      filtering: filteringOptions,
    };
  }

  async updateOne(input: UpdateUserInput) {
    const { userId, toUpdateUserId, ...payload } = input;

    const currentUser = await this.userRepository.findOne(userId);
    if (!currentUser) {
      throw new UserDoesNotExistError();
    }

    const toUpdateUser = await this.userRepository.findOne(toUpdateUserId, {
      relations: ['createdUser'],
    });
    if (!toUpdateUser) {
      throw new UserDoesNotExistError();
    }

    if (userId !== toUpdateUserId) {
      if (currentUser.role === UserRoleEnums.CUSTOMER) {
        throw new UserDoesNotHavePermissionError();
      }

      if (
        currentUser.role === UserRoleEnums.EMPLOYEE &&
        (!toUpdateUser.createdUser || toUpdateUser.createdUser.id !== userId)
      ) {
        throw new UserDoesNotHavePermissionError();
      }
    }

    Object.assign(toUpdateUser, {
      ...payload,
      password: payload.password && (await UserEntity.hashPassword(payload.password)),
    });

    return new UserDTO(await toUpdateUser.save(), {});
  }

  async deleteOne(userId: string, toDeleteUserId: string) {
    const currentUser = await this.userRepository.findOne(userId);
    if (!currentUser) {
      throw new UserDoesNotExistError();
    }

    // Customer cannot delete user
    if (currentUser.role === UserRoleEnums.CUSTOMER) {
      throw new UserDoesNotHavePermissionError();
    }

    if (userId === toDeleteUserId) {
      throw new DeleteYourselfError();
    }

    const toDeleteUser = await this.userRepository.findOne(toDeleteUserId, {
      relations: ['createdUser'],
    });
    if (!toDeleteUser) {
      throw new UserDoesNotExistError();
    }

    if (
      currentUser.role === UserRoleEnums.EMPLOYEE &&
      (!toDeleteUser.createdUser || toDeleteUser.createdUser.id !== userId)
    ) {
      throw new UserDoesNotHavePermissionError();
    }

    await this.userRepository.softRemove(toDeleteUser);
    return true;
  }
}
