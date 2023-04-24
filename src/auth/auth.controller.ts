import { AuthService } from './auth.service';

import { Body, Controller, Post, Response } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

// import { JWT_EXPIRY_SECONDS } from '../../shared/constants/global.constants';
const JWT_EXPIRY_SECONDS = 100000;
import { AuthResponseDto, LoginUserDto, RegisterUserDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ description: 'Login user' })
  // @ApiBody({ type: LoginUserDto })
  @ApiResponse({ type: AuthResponseDto })
  async login(
    @Body() user: LoginUserDto,
    @Response() res,
  ): Promise<AuthResponseDto> {
    const loginData = await this.authService.login(user);

    res.cookie('accessToken', loginData.accessToken, {
      expires: new Date(new Date().getTime() + JWT_EXPIRY_SECONDS * 1000),
      sameSite: 'strict',
      secure: true,
      httpOnly: true,
    });

    return res.status(200).send(loginData);
  }

  @Post('register')
  async register(@Body() user: RegisterUserDto): Promise<User> {
    return this.authService.register(user);
  }

  @Post('logout')
  logout(@Response() res): void {
    res.clearCookie('accessToken');
    res.status(200).send({ success: true });
  }
}
