import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { CreateUserDto, ResponseUserDto, UpdateUserDto } from './dto/user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiResponse({ type: ResponseUserDto, isArray: true })
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers({});
  }

  @Get(':id')
  @ApiResponse({ type: ResponseUserDto })
  async getUserById(@Param('id') id: number): Promise<User> {
    const user = await this.userService.getUserById(id);

    if (!user) throw new NotFoundException();

    return user;
  }

  @Post()
  @ApiResponse({ type: ResponseUserDto })
  async createUser(@Body() createUserData: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserData);
  }

  @Patch(':id')
  @ApiResponse({ type: ResponseUserDto })
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserData: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser({ id }, updateUserData);
  }

  @Delete(':id')
  @ApiResponse({ type: ResponseUserDto })
  async deleteUser(@Param('id') id: number): Promise<User> {
    return this.userService.deleteUser(id);
  }
}
