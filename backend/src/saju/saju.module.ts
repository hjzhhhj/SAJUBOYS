import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SajuController } from './saju.controller';
import { SajuService } from './saju.service';
import { SajuResult, SajuResultSchema } from './schemas/saju-result.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SajuResult.name, schema: SajuResultSchema },
    ]),
  ],
  controllers: [SajuController],
  providers: [SajuService],
  exports: [SajuService],
})
export class SajuModule {}
