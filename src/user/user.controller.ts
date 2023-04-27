import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Role, User } from '@prisma/client';
import {
  CreateUserDto,
  GetUsersParams,
  ResponseUserDto,
  UpdateUserDto,
} from './dto/user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';

const userCanOnlyHandleHisDataValidation = (user, id) => {
  if (user.role !== Role.ADMIN) {
    if (user.id !== id) throw new ForbiddenException();
  }
};

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: ResponseUserDto, isArray: true })
  async getUsers(@Query() query: GetUsersParams): Promise<any> {
    const findUserParams: any = {};
    if (query.limit) findUserParams.take = query.limit;
    if (query.offset) findUserParams.skip = query.offset;
    if (query.sort) findUserParams.orderBy = query.sort;
    if (query.queryParams) {
      findUserParams.where = {
        OR: [
          { id: Number(query.queryParams) ? Number(query.queryParams) : {} },
          { email: { contains: query.queryParams } },
        ],
        ...query.filter,
      };
    }
    if (query.filter) {
      findUserParams.where = { ...findUserParams.where, ...query.filter };
    }

    const [data, total] = await this.userService.getUsers(findUserParams);

    return { data, total };
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: ResponseUserDto })
  async getUserById(@Param('id') id: number, @Request() req): Promise<User> {
    userCanOnlyHandleHisDataValidation(req.user, id);

    const user = await this.userService.getUserById(id);

    if (!user) throw new NotFoundException();

    return user;
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: ResponseUserDto })
  async createUser(@Body() createUserData: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserData);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: ResponseUserDto })
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserData: UpdateUserDto,
    @Request() req,
  ): Promise<User> {
    userCanOnlyHandleHisDataValidation(req.user, id);
    let data = updateUserData;

    if (req.user.role !== Role.ADMIN) {
      const { role, ...safeFields } = updateUserData;
      data = safeFields;
    }

    return this.userService.updateUser({ id }, data);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: ResponseUserDto })
  async deleteUser(@Param('id') id: number, @Request() req): Promise<User> {
    userCanOnlyHandleHisDataValidation(req.user, id);
    return this.userService.deleteUser(id);
  }
}
