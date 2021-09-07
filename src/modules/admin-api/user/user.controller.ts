import {
  Controller,
  Get,
  Query,
  Req,
  HttpCode,
  Post,
  Body,
  Delete,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';

// DTOS
import { UserDTO } from './dtos/user.dto';
import { CreateUserDTO, CreateUserResponseDTO } from './dtos/create-user.dto';
import { UpdateUserDTO, UpdateUserResponseDTO } from './dtos/update-user.dto';
import { GetUsersQueryDTO, GetUsersResponseDTO } from './dtos/get-user.dto';
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

  @Post()
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateUserResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  async create(@Req() req: PassedAuthMiddlewareRequest, @Body() payload: CreateUserDTO) {
    return this.userService.createOne({ userId: req.user.id, ...payload });
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: GetUsersResponseDTO,
  })
  @HttpCode(200)
  getEvents(
    @Req() req: PassedAuthMiddlewareRequest,
    @Query() query: GetUsersQueryDTO,
  ): Promise<GetUsersResponseDTO> {
    const { user } = req;
    const { page, limit, sortBy, orderBy, ...filtering } = query;

    return this.userService.getMany(user.id, { page, limit }, { sortBy, orderBy }, filtering);
  }

  @Put(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: UpdateUserResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String })
  async update(
    @Param() params: { id: string },
    @Req() req: PassedAuthMiddlewareRequest,
    @Body() payload: UpdateUserDTO,
  ): Promise<UserDTO> {
    return this.userService.updateOne({
      ...payload,
      userId: req.user.id,
      toUpdateUserId: params.id,
    });
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
  })
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String })
  async delete(
    @Param() params: { id: string },
    @Req() req: PassedAuthMiddlewareRequest,
  ): Promise<boolean> {
    return this.userService.deleteOne(req.user.id, params.id);
  }
}
