import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';

import { IncorrectPasswordError } from './auth.error';
import { InvalidTokenError, TokenExpiredError } from '@common/errors/jwt-token.error';
import { CookieUtils, EncryptUtils, TokenUtils } from '@common/utils';

import { GenerateTokenReturn } from './auth.interface';
import { UserDTO } from '../user/dtos/user.dto';
import { UserEntity } from '@db/entities';
import { UserDoesNotExistError } from '../user/user.error';
import { EnvConfiguration } from '@config/configuration';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService<EnvConfiguration>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async signIn(username: string, password: string): Promise<GenerateTokenReturn> {
    const user = await this.userRepository.findOne({ username });
    if (!user) {
      throw new UserDoesNotExistError();
    }
    const isPasswordCorrect = await EncryptUtils.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new IncorrectPasswordError();
    }

    return this.generateToken(new UserDTO(user));
  }

  async validateRequest(req: Request): Promise<UserDTO> {
    const accessToken = req.headers.authorization
      ? TokenUtils.bearerSchemaToToken(req.headers.authorization)
      : String(CookieUtils.getToken(req));

    if (!accessToken) {
      throw new InvalidTokenError();
    }

    return this.validateToken(accessToken);
  }

  async validateToken(token: string) {
    const accessTokenDataObj = TokenUtils.verify<{ userId: string }>(
      token,
      `${this.configService.get('secret')}`,
    );
    const user = await this.userRepository.findOne(accessTokenDataObj.userId);
    if (!user) {
      throw new InvalidTokenError();
    }
    return new UserDTO(user);
  }

  async generateToken(user: UserDTO): Promise<GenerateTokenReturn> {
    const accessToken = TokenUtils.generate(
      { userId: user.id },
      this.configService.get('secret') as string,
      this.configService.get('tokenExpires') as number,
    );
    const refreshToken = TokenUtils.generate(
      { userId: user.id },
      `refresh_${this.configService.get('secret')}`,
      this.configService.get('refreshTokenExpires') as string,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<GenerateTokenReturn> {
    try {
      const accessTokenDataObj = await TokenUtils.verify<{ userId: string }>(
        refreshToken,
        `refresh_${this.configService.get('secret')}`,
      );
      const user = await this.userRepository.findOne(accessTokenDataObj.userId);
      if (!user) {
        throw new InvalidTokenError();
      }

      return this.generateToken(new UserDTO(user));
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new TokenExpiredError();
      }
      throw new InvalidTokenError();
    }
  }
}
