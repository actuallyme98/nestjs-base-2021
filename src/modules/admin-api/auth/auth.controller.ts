import { Controller, Post, Body, Res, HttpCode } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthValidateDTO, AuthResponseDTO, AuthRefreshTokenDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { CookieUtils } from '@common/utils';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({
    description: 'Sign in',
    status: 200,
    isArray: false,
    type: AuthResponseDTO,
  })
  @HttpCode(200)
  @Post('login')
  async signIn(@Body() payload: AuthValidateDTO, @Res() res: Response): Promise<AuthResponseDTO> {
    const loginData = await this.authService.signIn(payload.username, payload.password);
    CookieUtils.setToken(res, loginData.accessToken);
    return res.json(loginData) as any;
  }

  @ApiResponse({
    description: 'Refreshing Access Tokens',
    status: 200,
    isArray: false,
    type: AuthResponseDTO,
  })
  @HttpCode(200)
  @Post('refresh-token')
  async token(@Body() payload: AuthRefreshTokenDTO): Promise<AuthResponseDTO> {
    return this.authService.refreshToken(payload.refreshToken);
  }

  @ApiResponse({
    description: 'Sign out',
    status: 200,
    type: Boolean,
  })
  @HttpCode(200)
  @Post('logout')
  async signOut(@Res() res: Response) {
    CookieUtils.clearToken(res);
    return res.json(true);
  }
}
