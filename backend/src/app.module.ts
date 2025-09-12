import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SajuModule } from './saju/saju.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    CommonModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    SajuModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
