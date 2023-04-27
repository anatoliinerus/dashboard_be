import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

const cookieExtractor = (req) => req?.cookies.accessToken;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('token'),
        cookieExtractor,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }
}
