import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SajuResult, SajuResultDocument } from './schemas/saju-result.schema';
import { CalculateSajuDto } from './dto/saju.dto';
import { SajuCalculator } from './utils/saju-calculator';
import { SajuInterpreter } from './utils/saju-interpreter';
import { SajuAdvancedInterpreter } from './utils/saju-advanced-interpreter';
import type { CityCoordinate } from './korea-coordinates';

// 타입 정의
interface Pillar {
  heaven: string;
  earth: string;
}

interface FourPillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  time: Pillar | null;
}

interface AdvancedInterpretation {
  zodiacSign: any;
  daeunAnalysis: string;
  tenGodsAnalysis: string;
  specialPattern: string;
  dominantElement: string;
}

interface TimelyFortune {
  overall: string;
  advice: string;
  love: string;
  wealth: string;
  health: string;
}

export interface AddressResult {
  address: string;
  roadAddress: string;
  placeName: string;
  x: string;
  y: string;
}

@Injectable()
export class SajuService {
  constructor(
    @InjectModel(SajuResult.name)
    private sajuResultModel: Model<SajuResultDocument>,
  ) {}

  async calculateSaju(
    userId: string | null,
    calculateSajuDto: CalculateSajuDto,
  ) {
    const { gender, birthDate, birthTime, isTimeUnknown } = calculateSajuDto;

    // 생년월일시 파싱 - 로컬 시간대로 처리
    // birthDate는 'YYYY-MM-DD' 형식으로 들어옴
    const [birthYear, birthMonth, birthDay] = birthDate.split('-').map(Number);
    const [birthHour, birthMinute] = birthTime.split(':').map(Number);
    const birthDateTime = new Date(
      birthYear,
      birthMonth - 1,
      birthDay,
      birthHour,
      birthMinute,
      0,
    );
    const year = birthDateTime.getFullYear();
    const hour = birthDateTime.getHours();

    // 입춘 기준으로 사주년도 계산
    const sajuYear = SajuCalculator.getSajuYear(birthDateTime);

    // 사주 팔자 계산
    const yearPillar = SajuCalculator.getSixtyGapja(sajuYear);

    // 절기 기준 월 계산
    const solarMonth = SajuCalculator.getSolarMonth(birthDateTime);
    const monthPillar = SajuCalculator.getMonthPillar(
      yearPillar.heaven,
      solarMonth,
    );

    const dayPillar = SajuCalculator.getDayPillar(birthDateTime);
    const timePillar = isTimeUnknown
      ? null
      : SajuCalculator.getTimePillar(dayPillar.heaven, hour);

    const fourPillars = {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      time: timePillar,
    };

    // 오행 분석
    const elements = this.analyzeElements(fourPillars);

    // 음양 분석
    const yinYang = this.analyzeYinYang(fourPillars);

    // 대운 계산
    const daeun = SajuCalculator.calculateDaeun(
      gender,
      monthPillar,
      birthDateTime,
    );

    // 세운 계산 (현재 년도)
    const currentYear = new Date().getFullYear();
    const saeun = SajuCalculator.calculateSaeun(currentYear);

    // 사주 해석
    const interpretation = await this.generateInterpretation(
      gender,
      fourPillars,
      elements,
      yinYang,
      year,
      currentYear,
    );

    // 절기 정보
    const solarTerm = SajuCalculator.getSolarTerm(birthDateTime);

    const sajuResult = new this.sajuResultModel({
      userId: userId ? new Types.ObjectId(userId) : null,
      ...calculateSajuDto,
      fourPillars,
      interpretation,
      daeun,
      saeun,
      solarTerm,
      elements,
      yinYang,
      isTimeUnknown,
    });

    // 항상 저장 (userId가 없어도 임시 저장)
    await sajuResult.save();

    return sajuResult;
  }

  private analyzeElements(fourPillars: FourPillars): { [key: string]: number } {
    const elements = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };

    // 천간 오행 계산
    const heavenElements = [
      fourPillars.year.heaven,
      fourPillars.month.heaven,
      fourPillars.day.heaven,
    ];
    if (fourPillars.time) {
      heavenElements.push(fourPillars.time.heaven);
    }

    heavenElements.forEach((stem) => {
      const element =
        SajuCalculator.FIVE_ELEMENTS.천간[
          stem as keyof typeof SajuCalculator.FIVE_ELEMENTS.천간
        ];
      if (element) elements[element]++;
    });

    // 지지 오행 계산
    const earthElements = [
      fourPillars.year.earth,
      fourPillars.month.earth,
      fourPillars.day.earth,
    ];
    if (fourPillars.time) {
      earthElements.push(fourPillars.time.earth);
    }

    earthElements.forEach((branch) => {
      const element =
        SajuCalculator.FIVE_ELEMENTS.지지[
          branch as keyof typeof SajuCalculator.FIVE_ELEMENTS.지지
        ];
      if (element) elements[element]++;
    });

    return elements;
  }

  private analyzeYinYang(fourPillars: FourPillars): {
    yin: number;
    yang: number;
  } {
    let yin = 0;
    let yang = 0;

    // 천간의 음양
    const yangHeavenly = ['갑', '병', '무', '경', '임'];
    const yinHeavenly = ['을', '정', '기', '신', '계'];

    const heavenlyStems = [
      fourPillars.year.heaven,
      fourPillars.month.heaven,
      fourPillars.day.heaven,
    ];
    if (fourPillars.time) {
      heavenlyStems.push(fourPillars.time.heaven);
    }

    heavenlyStems.forEach((stem) => {
      if (yangHeavenly.includes(stem)) yang++;
      else if (yinHeavenly.includes(stem)) yin++;
    });

    // 지지의 음양
    const yangEarthly = ['자', '인', '진', '오', '신', '술'];
    const yinEarthly = ['축', '묘', '사', '미', '유', '해'];

    const earthlyBranches = [
      fourPillars.year.earth,
      fourPillars.month.earth,
      fourPillars.day.earth,
    ];
    if (fourPillars.time) {
      earthlyBranches.push(fourPillars.time.earth);
    }

    earthlyBranches.forEach((branch) => {
      if (yangEarthly.includes(branch)) yang++;
      else if (yinEarthly.includes(branch)) yin++;
    });

    return { yin, yang };
  }

  private async generateInterpretation(
    gender: string,
    fourPillars: FourPillars,
    elements: { [key: string]: number },
    yinYang: { yin: number; yang: number },
    birthYear: number,
    currentYear: number,
  ) {
    const dayHeavenly = fourPillars.day.heaven;
    const birthDateTime = new Date(`${birthYear}-01-01`);

    // 기본 성격 해석
    const personalityInfo =
      SajuInterpreter.PERSONALITY_BY_DAY_STEM[
        dayHeavenly as keyof typeof SajuInterpreter.PERSONALITY_BY_DAY_STEM
      ];
    const personality = personalityInfo
      ? `${personalityInfo.basic}\n강점: ${personalityInfo.strength}\n약점: ${personalityInfo.weakness}`
      : '균형잡힌 성격으로 다양한 상황에 잘 적응합니다.';

    // 오행 균형 해석
    const elementBalance = SajuInterpreter.interpretFiveElements(elements);

    // 음양 균형 해석
    const yinYangBalance = this.interpretYinYangBalance(yinYang);

    // 고급 해석 추가
    const advancedInterpretation: AdvancedInterpretation =
      SajuAdvancedInterpreter.generateAdvancedInterpretation(
        fourPillars,
        elements,
        yinYang,
        birthDateTime,
        gender,
      ) as AdvancedInterpretation;

    // 시기별 운세
    const timelyFortune: TimelyFortune =
      (await SajuAdvancedInterpreter.generateTimelyFortune(
        fourPillars,
        currentYear,
        elements,
        yinYang,
        gender,
      )) as TimelyFortune;

    // 직업 적성
    const career = SajuInterpreter.interpretCareer(dayHeavenly, elements);

    // 연애/결혼운
    const relationship = SajuInterpreter.interpretRelationship(
      gender,
      dayHeavenly,
    );

    // 재물운
    const wealth = SajuInterpreter.interpretWealth(
      dayHeavenly,
      fourPillars.year.earth,
    );

    // 건강운
    const health = SajuInterpreter.interpretHealth(elements);

    // 올해 운세 (AI 조언은 timelyFortune.advice에 이미 포함됨)
    const fortune = `${timelyFortune.overall}\n\n💡 올해 행동 가이드:\n${timelyFortune.advice}`;

    return {
      personality: `${personality}\n\n${yinYangBalance}`,
      career: `${career}`,
      relationship: `${relationship}\n\n${timelyFortune.love}`,
      wealth: `${wealth}\n\n${timelyFortune.wealth}`,
      health: `${health.trim()}\n\n${timelyFortune.health}`,
      fortune,
      elementBalance,
      yinYangBalance,
      advancedAnalysis: {
        daeunAnalysis: advancedInterpretation.daeunAnalysis,
        specialPattern: advancedInterpretation.specialPattern,
        tenGodsAnalysis: advancedInterpretation.tenGodsAnalysis,
        timelyFortune: timelyFortune,
      },
    };
  }

  async getSavedResults(userId: string) {
    return this.sajuResultModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getSajuById(userId: string, sajuId: string) {
    return this.sajuResultModel
      .findOne({
        _id: new Types.ObjectId(sajuId),
        userId: new Types.ObjectId(userId),
      })
      .exec();
  }

  private interpretYinYangBalance(yinYang: {
    yin: number;
    yang: number;
  }): string {
    const total = yinYang.yin + yinYang.yang;
    const yinRatio = (yinYang.yin / total) * 100;
    const yangRatio = (yinYang.yang / total) * 100;

    if (Math.abs(yinRatio - yangRatio) < 10) {
      return `음양이 균형을 이루고 있습니다 (음 ${yinRatio.toFixed(0)}% : 양 ${yangRatio.toFixed(0)}%). 조화로운 성격으로 다양한 상황에 유연하게 대처할 수 있습니다.`;
    } else if (yangRatio > yinRatio) {
      return `양기가 강한 사주입니다 (음 ${yinRatio.toFixed(0)}% : 양 ${yangRatio.toFixed(0)}%). 적극적이고 활동적이며, 리더십이 강합니다. 때로는 휴식과 내면의 평화를 찾는 것이 필요합니다.`;
    } else {
      return `음기가 강한 사주입니다 (음 ${yinRatio.toFixed(0)}% : 양 ${yangRatio.toFixed(0)}%). 신중하고 사려 깊으며, 내면의 힘이 강합니다. 때로는 적극적인 행동과 표현이 필요합니다.`;
    }
  }

  async saveResult(userId: string, sajuId: string) {
    const result = await this.sajuResultModel.findOne({
      _id: new Types.ObjectId(sajuId),
    });

    if (!result) {
      throw new Error('결과를 찾을 수 없습니다.');
    }

    // 이미 다른 사용자의 결과인지 확인
    if (result.userId && result.userId.toString() !== userId) {
      throw new Error('다른 사용자의 결과입니다.');
    }

    result.userId = new Types.ObjectId(userId);
    result.updatedAt = new Date();
    return result.save();
  }

  async deleteResult(userId: string, sajuId: string) {
    return this.sajuResultModel.deleteOne({
      _id: new Types.ObjectId(sajuId),
      userId: new Types.ObjectId(userId),
    });
  }

  async searchAddress(query: string): Promise<AddressResult[]> {
    // 한국 시·군·구 좌표 데이터 가져오기
    const { KOREA_COORDINATES } = (await import('./korea-coordinates.js')) as {
      KOREA_COORDINATES: CityCoordinate[];
    };

    // 검색어가 비어있으면 빈 배열 반환
    if (!query?.trim()) {
      return [];
    }

    // 검색어 정규화
    const searchQuery = query.toLowerCase().replace(/\s+/g, '');

    // 좌표 데이터에서 검색 및 중복 제거
    const uniqueResults = new Map<string, AddressResult>();

    KOREA_COORDINATES.forEach((coord) => {
      const cityDistrict = (coord.city + coord.district)
        .toLowerCase()
        .replace(/\s+/g, '');
      const districtOnly = coord.district.toLowerCase().replace(/\s+/g, '');

      if (
        cityDistrict.includes(searchQuery) ||
        districtOnly.includes(searchQuery)
      ) {
        const key = `${coord.city} ${coord.district}`;
        if (!uniqueResults.has(key)) {
          const fullAddress = `${coord.city} ${coord.district}`;
          uniqueResults.set(key, {
            placeName:
              coord.district === '세종시' ? '세종특별자치시' : fullAddress,
            address: fullAddress,
            roadAddress: fullAddress,
            x: coord.longitude.toString(),
            y: coord.latitude.toString(),
          });
        }
      }
    });

    // 최대 30개 결과 반환
    return Array.from(uniqueResults.values()).slice(0, 30);
  }
}
