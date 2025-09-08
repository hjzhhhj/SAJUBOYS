import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  UseGuards,
  Request,
  ValidationPipe,
  Param,
  Query,
} from '@nestjs/common';
import { SajuService } from './saju.service';
import { CalculateSajuDto } from './dto/saju.dto';
import { SearchAddressDto } from './dto/search-address.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('saju')
export class SajuController {
  constructor(private sajuService: SajuService) {}

  @Get('search-address')
  async searchAddress(@Query() searchAddressDto: SearchAddressDto) {
    const results = await this.sajuService.searchAddress(
      searchAddressDto.query,
    );
    return {
      success: true,
      data: results,
    };
  }

  @Post('calculate')
  async calculateSaju(
    @Request() req,
    @Body(ValidationPipe) calculateSajuDto: CalculateSajuDto,
  ) {
    // 임시로 사용자 ID 없이 처리 (인증 옵션)
    const userId = req.user?._id || null;
    const result = await this.sajuService.calculateSaju(
      userId,
      calculateSajuDto,
    );
    return {
      success: true,
      message: '사주 계산이 완료되었습니다',
      data: result,
    };
  }

  @Get('saved')
  @UseGuards(JwtAuthGuard)
  async getSavedResults(@Request() req) {
    const results = await this.sajuService.getSavedResults(req.user._id);
    return {
      success: true,
      message: '저장된 사주 결과를 가져왔습니다',
      data: results,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getSajuById(@Request() req, @Param('id') sajuId: string) {
    const result = await this.sajuService.getSajuById(req.user._id, sajuId);
    return {
      success: true,
      message: '사주 결과를 가져왔습니다',
      data: result,
    };
  }

  @Post(':id/save')
  @UseGuards(JwtAuthGuard)
  async saveResult(@Request() req, @Param('id') sajuId: string) {
    const result = await this.sajuService.saveResult(req.user._id, sajuId);
    return {
      success: true,
      message: '사주 결과가 저장되었습니다',
      data: result,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteResult(@Request() req, @Param('id') sajuId: string) {
    await this.sajuService.deleteResult(req.user._id, sajuId);
    return {
      success: true,
      message: '사주 결과가 삭제되었습니다',
    };
  }
}
