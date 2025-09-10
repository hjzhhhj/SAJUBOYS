import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') ||
        'your-very-secure-secret-key-here-change-in-production',
    });
  }

  async validate(payload: any) {
    console.log('JWT Strategy - Validating payload:', payload);
    const user = await this.authService.validateUser(payload);
    console.log('JWT Strategy - User found:', user ? user._id : 'null');

    if (!user) {
      console.log('JWT Strategy - User not found, returning null');
      return null;
    }

    // Passport는 이 반환값을 req.user에 설정합니다
    return user;
  }
}
