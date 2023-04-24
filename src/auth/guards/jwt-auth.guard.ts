import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  roles: string[];

  constructor(private reflector: Reflector) {
    super(reflector);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    this.roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!this.roles) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err: Error, user: User): any {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    if (!this.roles) {
      return user;
    }

    const hasPermission = this.roles.includes(user.role);
    if (!hasPermission) {
      throw new ForbiddenException();
    }

    return user;
  }
}
