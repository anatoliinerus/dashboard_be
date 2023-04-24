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
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Role, User } from '@prisma/client';
import { CreateUserDto, ResponseUserDto, UpdateUserDto } from './dto/user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

const userCanOnlyHandleHisDataValidation = (user, id) => {
  if (user.role === Role.USER && user.id !== id) {
    throw new ForbiddenException();
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
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers({});
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

    return this.userService.updateUser({ id }, updateUserData);
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
