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

interface RequestWithUser {
  user?: {
    _id: string;
  };
}

interface AuthenticatedRequest {
  user: {
    _id: string;
  };
}

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
    @Request() req: RequestWithUser,
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
  async getSavedResults(@Request() req: AuthenticatedRequest) {
    const results = await this.sajuService.getSavedResults(req.user._id);
    return {
      success: true,
      message: '저장된 사주 결과를 가져왔습니다',
      data: results,
    };
  }

  @Get('recent')
  async getRecentResults(
    @Request() req: RequestWithUser,
    @Query('limit') limit?: string,
  ) {
    const userId = req.user?._id || null;
    const limitNum = limit ? parseInt(limit, 10) : 5;
    const results = await this.sajuService.getRecentResults(userId, limitNum);
    return {
      success: true,
      message: '최근 사주 결과를 가져왔습니다',
      data: results,
    };
  }

  @Post('bulk-save')
  @UseGuards(JwtAuthGuard)
  async saveBulkResults(
    @Request() req: AuthenticatedRequest,
    @Body() body: { sajuIds: string[] },
  ) {
    const result = await this.sajuService.saveBulkResults(
      req.user._id,
      body.sajuIds,
    );
    return {
      success: true,
      message: `${result.modifiedCount}개의 사주 결과가 저장되었습니다`,
      data: result,
    };
  }

  @Post(':id/save')
  @UseGuards(JwtAuthGuard)
  async saveResult(
    @Request() req: AuthenticatedRequest,
    @Param('id') sajuId: string,
  ) {
    const result = await this.sajuService.saveResult(req.user._id, sajuId);
    return {
      success: true,
      message: '사주 결과가 저장되었습니다',
      data: result,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getSajuById(
    @Request() req: AuthenticatedRequest,
    @Param('id') sajuId: string,
  ) {
    const result = await this.sajuService.getSajuById(req.user._id, sajuId);
    return {
      success: true,
      message: '사주 결과를 가져왔습니다',
      data: result,
    };
  }

  @Delete('cleanup/temp')
  async cleanupTempResults() {
    const result = await this.sajuService.cleanupTempResults();
    return {
      success: true,
      message: `${result.deletedCount}개의 임시 결과가 정리되었습니다`,
      data: result,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteResult(
    @Request() req: AuthenticatedRequest,
    @Param('id') sajuId: string,
  ) {
    await this.sajuService.deleteResult(req.user._id, sajuId);
    return {
      success: true,
      message: '사주 결과가 삭제되었습니다',
    };
  }
}
