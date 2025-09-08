import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { SignupDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { name, email, password } = signupDto;

    // 이메일 중복 체크
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('이미 가입된 이메일입니다');
    }

    // 비밀번호 암호화
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 사용자 생성
    const user = new this.userModel({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // 비밀번호 제외하고 반환
    const { password: _, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 사용자 찾기
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 이메일입니다');
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다');
    }

    // JWT 토큰 생성
    const payload = { sub: user._id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    // 비밀번호 제외하고 반환
    const { password: _, ...userWithoutPassword } = user.toObject();

    return {
      user: userWithoutPassword,
      accessToken,
    };
  }

  async validateUser(payload: any): Promise<any> {
    const user = await this.userModel.findById(payload.sub);
    if (user) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }
}
