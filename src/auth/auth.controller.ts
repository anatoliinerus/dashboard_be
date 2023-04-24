import { AuthService } from './auth.service';

import {
  Body,
  Controller,
  Post,
  Response,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AuthResponseDto, LoginUserDto, RegisterUserDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ description: 'Login user' })
  @ApiResponse({ type: AuthResponseDto })
  async login(
    @Body() user: LoginUserDto,
    @Request() req,
    @Response() res,
  ): Promise<any> {
    const loginData = await this.authService.login(req.user);
    res.cookie('accessToken', loginData.accessToken, {
      expires: new Date(
        new Date().getTime() + Number(process.env.COOKIE_EXPIRES_IN),
      ),
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
  @UseGuards(JwtAuthGuard)
  logout(@Response() res): void {
    res.clearCookie('accessToken');
    res.status(200).send({ success: true });
  }
}
