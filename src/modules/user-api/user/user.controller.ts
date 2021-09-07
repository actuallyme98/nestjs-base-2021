import { Controller, Get, Req, HttpCode } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
// DTOS
import { UserDTO } from './dtos/user.dto';
// services
import { UserService } from './user.service';
import { PassedAuthMiddlewareRequest } from '@modules/admin-api/admin-api.middleware';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiResponse({
    status: 200,
    type: UserDTO,
  })
  @HttpCode(200)
  getProfile(@Req() req: PassedAuthMiddlewareRequest): Promise<UserDTO> {
    return this.userService.getMe(req.user.id);
  }
}
