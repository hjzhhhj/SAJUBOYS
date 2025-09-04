import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SajuResult, SajuResultDocument } from './schemas/saju-result.schema';
import { CalculateSajuDto } from './dto/saju.dto';
import { SajuCalculator } from './utils/saju-calculator';
import { SajuInterpreter } from './utils/saju-interpreter';
import { SajuAdvancedInterpreter } from './utils/saju-advanced-interpreter';
import axios, { AxiosError } from 'axios';

// 타입 정의
interface Pillar {
  heaven: string;
  earth: string;
}

interface FourPillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  time: Pillar;
}

export interface AddressResult {
  address: string;
  roadAddress: string;
  placeName: string;
  x: string;
  y: string;
}

interface KakaoDocument {
  address_name?: string;
  road_address_name?: string;
  place_name?: string;
  x?: string;
  y?: string;
  address?: {
    address_name?: string;
    x?: string;
    y?: string;
  };
  road_address?: {
    address_name?: string;
  };
}

interface KakaoApiResponse {
  documents: KakaoDocument[];
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
    const { gender, birthDate, birthTime } = calculateSajuDto;

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
    const timePillar = SajuCalculator.getTimePillar(dayPillar.heaven, hour);

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
    const interpretation = this.generateInterpretation(
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
    });

    // userId가 있을 때만 저장
    if (userId) {
      await sajuResult.save();
    }

    return sajuResult;
  }

  private analyzeElements(fourPillars: FourPillars): { [key: string]: number } {
    const elements = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };

    // 천간 오행 계산
    const heavenElements = [
      fourPillars.year.heaven,
      fourPillars.month.heaven,
      fourPillars.day.heaven,
      fourPillars.time.heaven,
    ];

    heavenElements.forEach((stem) => {
      const element = SajuCalculator.FIVE_ELEMENTS.천간[stem];
      if (element) elements[element]++;
    });

    // 지지 오행 계산
    const earthElements = [
      fourPillars.year.earth,
      fourPillars.month.earth,
      fourPillars.day.earth,
      fourPillars.time.earth,
    ];

    earthElements.forEach((branch) => {
      const element = SajuCalculator.FIVE_ELEMENTS.지지[branch];
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
      fourPillars.time.heaven,
    ];

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
      fourPillars.time.earth,
    ];

    earthlyBranches.forEach((branch) => {
      if (yangEarthly.includes(branch)) yang++;
      else if (yinEarthly.includes(branch)) yin++;
    });

    return { yin, yang };
  }

  private generateInterpretation(
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
      SajuInterpreter.PERSONALITY_BY_DAY_STEM[dayHeavenly];
    const personality = personalityInfo
      ? `${personalityInfo.basic}\n강점: ${personalityInfo.strength}\n약점: ${personalityInfo.weakness}`
      : '균형잡힌 성격으로 다양한 상황에 잘 적응합니다.';

    // 오행 균형 해석
    const elementBalance = SajuInterpreter.interpretFiveElements(elements);

    // 음양 균형 해석
    const yinYangBalance = this.interpretYinYangBalance(yinYang);

    // 고급 해석 추가
    const advancedInterpretation =
      SajuAdvancedInterpreter.generateAdvancedInterpretation(
        fourPillars,
        elements,
        yinYang,
        birthDateTime,
        gender,
      );

    // 시기별 운세
    const timelyFortune = SajuAdvancedInterpreter.generateTimelyFortune(
      fourPillars,
      currentYear,
    );

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

    // 올해 운세 (고급 버전 사용)
    const fortune = timelyFortune.overall + '\n' + timelyFortune.advice;

    // 띠 해석 추가
    const zodiacInfo = advancedInterpretation.zodiacSign;

    return {
      personality: `${personality}\n\n${elementBalance}\n\n${yinYangBalance}\n\n띠: ${zodiacInfo?.animal || ''}\n${zodiacInfo?.personality || ''}`,
      career: `${career}\n\n추천 직업: ${zodiacInfo?.career || ''}`,
      relationship: `${relationship}\n\n${timelyFortune.love}\n\n궁합: ${zodiacInfo?.compatibility || ''}`,
      wealth: `${wealth}\n\n${timelyFortune.wealth}`,
      health: `${health}\n\n${timelyFortune.health}`,
      fortune,
      elementBalance,
      yinYangBalance,
      advancedAnalysis: {
        zodiac: zodiacInfo,
        daeunAnalysis: advancedInterpretation.daeunAnalysis,
        specialPattern: advancedInterpretation.specialPattern,
        tenGodsAnalysis: advancedInterpretation.tenGodsAnalysis,
        timelyFortune,
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

  // 더미 데이터 생성 함수 (테스트용으로 남겨둠)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private generateDummyFourPillars(): FourPillars {
    const heavenlyStems = [
      '갑',
      '을',
      '병',
      '정',
      '무',
      '기',
      '경',
      '신',
      '임',
      '계',
    ];
    const earthlyBranches = [
      '자',
      '축',
      '인',
      '묘',
      '진',
      '사',
      '오',
      '미',
      '신',
      '유',
      '술',
      '해',
    ];

    return {
      year: {
        heaven: heavenlyStems[Math.floor(Math.random() * heavenlyStems.length)],
        earth:
          earthlyBranches[Math.floor(Math.random() * earthlyBranches.length)],
      },
      month: {
        heaven: heavenlyStems[Math.floor(Math.random() * heavenlyStems.length)],
        earth:
          earthlyBranches[Math.floor(Math.random() * earthlyBranches.length)],
      },
      day: {
        heaven: heavenlyStems[Math.floor(Math.random() * heavenlyStems.length)],
        earth:
          earthlyBranches[Math.floor(Math.random() * earthlyBranches.length)],
      },
      time: {
        heaven: heavenlyStems[Math.floor(Math.random() * heavenlyStems.length)],
        earth:
          earthlyBranches[Math.floor(Math.random() * earthlyBranches.length)],
      },
    };
  }

  // 더미데이터 사용했던 부분!
  // private generateDummyInterpretation() {
  //   const personalities = [
  //     '당신은 리더십이 강하고 창의적인 성격을 가지고 있습니다. 타고난 카리스마로 주변 사람들을 이끄는 능력이 있으며, 새로운 아이디어를 실현하는 데 탁월한 재능을 보입니다.',
  //     '차분하고 신중한 성격으로 모든 일을 꼼꼼히 계획하여 진행합니다. 안정을 추구하며, 주변 사람들에게 신뢰받는 든든한 존재입니다.',
  //     '활발하고 에너지가 넘치는 성격입니다. 새로운 도전을 즐기며, 긍정적인 마인드로 어떤 어려움도 극복해나갑니다.',
  //   ];

  //   const careers = [
  //     '경영, 기획, 창업 분야에서 큰 성공을 거둘 수 있습니다. 특히 혁신적인 아이디어가 필요한 분야에서 두각을 나타낼 것입니다.',
  //     '교육, 연구, 전문직 분야에서 뛰어난 성과를 보일 수 있습니다. 꾸준한 노력과 전문성으로 인정받게 될 것입니다.',
  //     '예술, 디자인, 엔터테인먼트 분야에서 재능을 발휘할 수 있습니다. 창의성을 바탕으로 많은 사람들에게 영감을 줄 것입니다.',
  //   ];

  //   const relationships = [
  //     '열정적이고 헌신적인 연애를 하는 타입입니다. 파트너와의 소통을 중요시하며, 서로를 존중하는 관계를 추구합니다.',
  //     '진실하고 깊이 있는 관계를 선호합니다. 한번 사랑하면 오래가는 편이며, 상대방을 위해 많은 것을 희생할 수 있습니다.',
  //     '자유롭고 개방적인 연애관을 가지고 있습니다. 상대방의 개성을 존중하며, 함께 성장해나가는 관계를 원합니다.',
  //   ];

  //   const fortunes = [
  //     '올해는 새로운 기회가 많이 찾아올 시기입니다. 과감한 도전이 좋은 결과를 가져올 수 있으니, 망설이지 말고 행동하세요.',
  //     '안정적인 발전이 기대되는 시기입니다. 꾸준한 노력을 통해 목표를 달성할 수 있으며, 주변의 도움도 많이 받을 것입니다.',
  //     '변화와 전환의 시기입니다. 새로운 환경이나 분야에 도전해볼 좋은 기회이니, 적극적으로 변화를 받아들이세요.',
  //   ];

  //   return {
  //     personality: personalities[Math.floor(Math.random() * personalities.length)],
  //     career: careers[Math.floor(Math.random() * careers.length)],
  //     relationship: relationships[Math.floor(Math.random() * relationships.length)],
  //     fortune: fortunes[Math.floor(Math.random() * fortunes.length)],
  //   };
  // }

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

    result.userId = new Types.ObjectId(userId);
    return result.save();
  }

  async deleteResult(userId: string, sajuId: string) {
    return this.sajuResultModel.deleteOne({
      _id: new Types.ObjectId(sajuId),
      userId: new Types.ObjectId(userId),
    });
  }

  async searchAddress(query: string): Promise<AddressResult[]> {
    // 더미 데이터
    const dummyData: AddressResult[] = [
      {
        placeName: '서울특별시청',
        address: '서울특별시 중구 세종대로 110',
        roadAddress: '서울특별시 중구 태평로1가 31',
        x: '126.9779',
        y: '37.5663',
      },
      {
        placeName: '강남구청',
        address: '서울특별시 강남구 학동로 426',
        roadAddress: '서울특별시 강남구 삼성동 16-1',
        x: '127.0476',
        y: '37.5172',
      },
      {
        placeName: '성균관대학교',
        address: '서울특별시 종로구 성균관로 25-2',
        roadAddress: '서울특별시 종로구 명륜3가 53',
        x: '126.9939',
        y: '37.5881',
      },
      {
        placeName: '경복궁',
        address: '서울특별시 종로구 사직로 161',
        roadAddress: '서울특별시 종로구 세종로 1-91',
        x: '126.9769',
        y: '37.5788',
      },
      {
        placeName: '남산서울타워',
        address: '서울특별시 용산구 남산공원길 105',
        roadAddress: '서울특별시 용산구 용산동2가 1-3',
        x: '126.9882',
        y: '37.5512',
      },
      {
        placeName: '잠실롯데월드타워',
        address: '서울특별시 송파구 올림픽로 300',
        roadAddress: '서울특별시 송파구 신천동 29',
        x: '127.1025',
        y: '37.5126',
      },
      {
        placeName: '서울역',
        address: '서울특별시 용산구 한강대로 405',
        roadAddress: '서울특별시 중구 남대문로5가 122',
        x: '126.9708',
        y: '37.5547',
      },
      {
        placeName: '광화문광장',
        address: '서울특별시 종로구 세종로 172',
        roadAddress: '서울특별시 종로구 세종로 1-68',
        x: '126.9768',
        y: '37.5718',
      },
    ];

    try {
      const apiKey = process.env.KAKAO_REST_API_KEY;

      // API 키가 없으면 더미 데이터 반환
      if (!apiKey) {
        console.log('카카오 API 키가 설정되지 않음, 더미 데이터 사용');
        const filtered = dummyData.filter(
          (item) =>
            item.placeName.toLowerCase().includes(query.toLowerCase()) ||
            item.address.includes(query) ||
            item.roadAddress.includes(query),
        );
        return filtered.length > 0 ? filtered : dummyData.slice(0, 5);
      }

      // 카카오 주소 검색 API 호출
      const response = await axios.get<KakaoApiResponse>(
        'https://dapi.kakao.com/v2/local/search/address.json',
        {
          headers: {
            Authorization: `KakaoAK ${apiKey}`,
          },
          params: {
            query: query,
            size: 30,
          },
          timeout: 5000, // 5초 타임아웃
        },
      );

      // 키워드 검색도 함께 수행 (더 많은 결과를 얻기 위해)
      const keywordResponse = await axios.get<KakaoApiResponse>(
        'https://dapi.kakao.com/v2/local/search/keyword.json',
        {
          headers: {
            Authorization: `KakaoAK ${apiKey}`,
          },
          params: {
            query: query,
            size: 30,
          },
          timeout: 5000, // 5초 타임아웃
        },
      );

      // 두 결과를 합치고 중복 제거
      const addressResults: AddressResult[] = response.data.documents.map(
        (doc: KakaoDocument) => ({
          address: doc.address_name || doc.address?.address_name || '',
          roadAddress:
            doc.road_address_name || doc.road_address?.address_name || '',
          placeName: doc.address_name || doc.address?.address_name || '',
          x: doc.x || doc.address?.x || '',
          y: doc.y || doc.address?.y || '',
        }),
      );

      const keywordResults: AddressResult[] =
        keywordResponse.data.documents.map((doc: KakaoDocument) => ({
          address: doc.address_name || '',
          roadAddress: doc.road_address_name || '',
          placeName: doc.place_name || '',
          x: doc.x || '',
          y: doc.y || '',
        }));

      // 중복 제거 (좌표 기준)
      const combinedResults = [...addressResults];
      keywordResults.forEach((kResult) => {
        if (
          !combinedResults.some(
            (aResult) => aResult.x === kResult.x && aResult.y === kResult.y,
          )
        ) {
          combinedResults.push(kResult);
        }
      });

      console.log(`검색어: ${query} 결과: ${combinedResults.length}개`);

      return combinedResults.slice(0, 30); // 최대 30개 반환
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(
        '주소 검색 중 오류 발생:',
        axiosError.response?.data || axiosError.message,
      );

      // API 오류 시 더미 데이터 반환
      console.log('API 오류로 더미 데이터 사용');
      const filtered = dummyData.filter(
        (item) =>
          item.placeName.toLowerCase().includes(query.toLowerCase()) ||
          item.address.includes(query) ||
          item.roadAddress.includes(query),
      );
      return filtered.length > 0 ? filtered : dummyData.slice(0, 5);
    }
  }
}
