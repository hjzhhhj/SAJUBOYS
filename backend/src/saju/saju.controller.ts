import { Controller, Post, Get, Body, UseGuards, Request, ValidationPipe, Param } from '@nestjs/common';
import { SajuService } from './saju.service';
import { CalculateSajuDto } from './dto/saju.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('saju')
@UseGuards(JwtAuthGuard)
export class SajuController {
  constructor(private sajuService: SajuService) {}

  @Post('calculate')
  async calculateSaju(
    @Request() req,
    @Body(ValidationPipe) calculateSajuDto: CalculateSajuDto,
  ) {
    const result = await this.sajuService.calculateSaju(req.user._id, calculateSajuDto);
    return {
      success: true,
      message: '사주 계산이 완료되었습니다',
      data: result,
    };
  }

  @Get('saved')
  async getSavedResults(@Request() req) {
    const results = await this.sajuService.getSavedResults(req.user._id);
    return {
      success: true,
      message: '저장된 사주 결과를 가져왔습니다',
      data: results,
    };
  }

  @Get(':id')
  async getSajuById(@Request() req, @Param('id') sajuId: string) {
    const result = await this.sajuService.getSajuById(req.user._id, sajuId);
    return {
      success: true,
      message: '사주 결과를 가져왔습니다',
      data: result,
    };
  }
}