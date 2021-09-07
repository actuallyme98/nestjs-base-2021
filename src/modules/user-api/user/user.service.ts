import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '@db/entities';
import { UserDTO } from './dtos/user.dto';
// errors
import { UserDoesNotExistError } from './user.error';

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
}
