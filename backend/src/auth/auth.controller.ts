import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body(ValidationPipe) dto: SignupDto) {
    return {
      success: true,
      message: '회원가입이 완료되었습니다',
      data: await this.authService.signup(dto),
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body(ValidationPipe) dto: LoginDto) {
    return {
      success: true,
      message: '로그인이 완료되었습니다',
      data: await this.authService.login(dto),
    };
  }
}
