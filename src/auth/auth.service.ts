import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { RegisterUserDto } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthHelpers } from './helpers/auth.helpers';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  public async register(user: RegisterUserDto): Promise<User> {
    return this.userService.createUser(user);
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findUserByEmail(username);

    if (!user) return null;

    const isMatch = await AuthHelpers.verify(pass, user.password);

    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { id: user.id, email: user.email, role: user.role };
    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
