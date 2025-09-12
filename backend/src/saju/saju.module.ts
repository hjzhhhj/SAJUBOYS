import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SajuController } from './saju.controller';
import { SajuService } from './saju.service';
import { SajuResult, SajuResultSchema } from './schemas/saju-result.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SajuResult.name, schema: SajuResultSchema },
    ]),
    AuthModule,
  ],
  controllers: [SajuController],
  providers: [SajuService],
  exports: [SajuService],
})
export class SajuModule {}
