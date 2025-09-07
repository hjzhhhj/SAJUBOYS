import { LICHUN_BY_YEAR } from './lichun-dates';

export class SajuCalculator {
  // 천간 (10개)
  static HEAVENLY_STEMS = [
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

  // 지지 (12개)
  static EARTHLY_BRANCHES = [
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

  // 오행
  static FIVE_ELEMENTS = {
    천간: {
      갑: '목',
      을: '목',
      병: '화',
      정: '화',
      무: '토',
      기: '토',
      경: '금',
      신: '금',
      임: '수',
      계: '수',
    },
    지지: {
      자: '수',
      축: '토',
      인: '목',
      묘: '목',
      진: '토',
      사: '화',
      오: '화',
      미: '토',
      신: '금',
      유: '금',
      술: '토',
      해: '수',
    },
  };

  // 60갑자 계산 (입춘 기준)
  static getSixtyGapja(year: number): { heaven: string; earth: string } {
    // 기준년도: 1984년은 갑자년 (천간 0, 지지 0)
    const baseYear = 1984;
    const diff = year - baseYear;

    let heavenIndex = diff % 10;
    let earthIndex = diff % 12;

    // 음수 처리
    if (heavenIndex < 0) heavenIndex += 10;
    if (earthIndex < 0) earthIndex += 12;

    return {
      heaven: this.HEAVENLY_STEMS[heavenIndex],
      earth: this.EARTHLY_BRANCHES[earthIndex],
    };
  }

  // 입춘 기준으로 실제 사주년도 계산
  static getSajuYear(birthDate: Date): number {
    const year = birthDate.getFullYear();
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();

    // 입춘 날짜 가져오기
    const lichunDate = LICHUN_BY_YEAR[year];
    if (!lichunDate) {
      // 데이터가 없는 경우 기본값 사용 (2월 4일)
      const lichunMonth = 2;
      const lichunDay = 4;

      if (month < lichunMonth || (month === lichunMonth && day < lichunDay)) {
        return year - 1;
      }
      return year;
    }

    const [lichunMonth, lichunDay] = lichunDate.split('-').map(Number);

    // 입춘 이전이면 전년도로 계산
    if (month < lichunMonth || (month === lichunMonth && day < lichunDay)) {
      return year - 1;
    }

    return year;
  }

  // 월간지 계산
  static getMonthPillar(
    yearHeavenly: string,
    month: number,
  ): { heaven: string; earth: string } {
    // 월지 (정월부터 시작)
    const monthBranches = [
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
      '자',
      '축',
    ];

    // 년간에 따른 월간 시작점
    const monthHeavenStart = {
      갑: 2,
      기: 2, // 병인월부터
      을: 4,
      경: 4, // 무인월부터
      병: 0,
      신: 0, // 경인월부터
      정: 2,
      임: 2, // 임인월부터
      무: 4,
      계: 4, // 갑인월부터
    };

    const startIndex = monthHeavenStart[yearHeavenly];
    const heavenIndex = (startIndex + month - 1) % 10;

    return {
      heaven: this.HEAVENLY_STEMS[heavenIndex],
      earth: monthBranches[month - 1],
    };
  }

  // 일간지 계산 (1900년 1월 1일을 기준으로)
  static getDayPillar(date: Date): { heaven: string; earth: string } {
    // 1900년 1월 1일은 갑진일
    const baseDate = new Date(1900, 0, 1);
    const diffTime = Math.abs(date.getTime() - baseDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const heavenIndex = diffDays % 10;
    const earthIndex = (diffDays + 4) % 12; // 진(4)부터 시작

    return {
      heaven: this.HEAVENLY_STEMS[heavenIndex],
      earth: this.EARTHLY_BRANCHES[earthIndex],
    };
  }

  // 시간지 계산
  static getTimePillar(
    dayHeavenly: string,
    hour: number,
  ): { heaven: string; earth: string } {
    // 시간별 지지
    const timeBranches = [
      '자', // 23-01시
      '축', // 01-03시
      '인', // 03-05시
      '묘', // 05-07시
      '진', // 07-09시
      '사', // 09-11시
      '오', // 11-13시
      '미', // 13-15시
      '신', // 15-17시
      '유', // 17-19시
      '술', // 19-21시
      '해', // 21-23시
    ];

    // 시간 인덱스 계산
    let timeIndex = 0;
    if (hour >= 23 || hour < 1) timeIndex = 0;
    else if (hour < 3) timeIndex = 1;
    else if (hour < 5) timeIndex = 2;
    else if (hour < 7) timeIndex = 3;
    else if (hour < 9) timeIndex = 4;
    else if (hour < 11) timeIndex = 5;
    else if (hour < 13) timeIndex = 6;
    else if (hour < 15) timeIndex = 7;
    else if (hour < 17) timeIndex = 8;
    else if (hour < 19) timeIndex = 9;
    else if (hour < 21) timeIndex = 10;
    else timeIndex = 11;

    // 일간에 따른 시간 천간 계산
    const dayHeavenIndex = this.HEAVENLY_STEMS.indexOf(dayHeavenly);
    const timeHeavenStart = (dayHeavenIndex * 2) % 10;
    const timeHeavenIndex = (timeHeavenStart + timeIndex) % 10;

    return {
      heaven: this.HEAVENLY_STEMS[timeHeavenIndex],
      earth: timeBranches[timeIndex],
    };
  }

  // 대운 계산
  static calculateDaeun(
    gender: string,
    yearPillar: { heaven: string; earth: string },
    birthDate: Date,
  ): Array<{ age: number; pillar: { heaven: string; earth: string } }> {
    const daeunList: Array<{
      age: number;
      pillar: { heaven: string; earth: string };
    }> = [];

    // 양남음녀 순행, 음남양녀 역행
    const yearHeavenIndex = this.HEAVENLY_STEMS.indexOf(yearPillar.heaven);
    const isYang = yearHeavenIndex % 2 === 0;
    const isForward =
      (gender === '남' && isYang) || (gender === '여' && !isYang);

    // 대운 시작 나이 계산 (간단히 10년으로 설정)
    let startAge = 10;

    // 월간지 기준으로 대운 계산
    const monthHeavenIndex = this.HEAVENLY_STEMS.indexOf(yearPillar.heaven);
    const monthEarthIndex = this.EARTHLY_BRANCHES.indexOf(yearPillar.earth);

    for (let i = 0; i < 8; i++) {
      const age = startAge + i * 10;

      let heavenIdx, earthIdx;
      if (isForward) {
        heavenIdx = (monthHeavenIndex + i + 1) % 10;
        earthIdx = (monthEarthIndex + i + 1) % 12;
      } else {
        heavenIdx = (monthHeavenIndex - i - 1 + 10) % 10;
        earthIdx = (monthEarthIndex - i - 1 + 12) % 12;
      }

      daeunList.push({
        age,
        pillar: {
          heaven: this.HEAVENLY_STEMS[heavenIdx],
          earth: this.EARTHLY_BRANCHES[earthIdx],
        },
      });
    }

    return daeunList;
  }

  // 세운 계산 (현재 년도 기준)
  static calculateSaeun(currentYear: number): {
    heaven: string;
    earth: string;
  } {
    return this.getSixtyGapja(currentYear);
  }

  // 절기 계산 (간단한 버전)
  static getSolarTerm(date: Date): string {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const solarTerms = [
      { month: 1, day: 5, name: '소한' },
      { month: 1, day: 20, name: '대한' },
      { month: 2, day: 4, name: '입춘' },
      { month: 2, day: 19, name: '우수' },
      { month: 3, day: 5, name: '경칩' },
      { month: 3, day: 20, name: '춘분' },
      { month: 4, day: 5, name: '청명' },
      { month: 4, day: 20, name: '곡우' },
      { month: 5, day: 5, name: '입하' },
      { month: 5, day: 21, name: '소만' },
      { month: 6, day: 6, name: '망종' },
      { month: 6, day: 21, name: '하지' },
      { month: 7, day: 7, name: '소서' },
      { month: 7, day: 23, name: '대서' },
      { month: 8, day: 8, name: '입추' },
      { month: 8, day: 23, name: '처서' },
      { month: 9, day: 8, name: '백로' },
      { month: 9, day: 23, name: '추분' },
      { month: 10, day: 8, name: '한로' },
      { month: 10, day: 23, name: '상강' },
      { month: 11, day: 7, name: '입동' },
      { month: 11, day: 22, name: '소설' },
      { month: 12, day: 7, name: '대설' },
      { month: 12, day: 22, name: '동지' },
    ];

    // 현재 날짜에 가장 가까운 절기 찾기
    for (let i = solarTerms.length - 1; i >= 0; i--) {
      if (
        month > solarTerms[i].month ||
        (month === solarTerms[i].month && day >= solarTerms[i].day)
      ) {
        return solarTerms[i].name;
      }
    }

    return solarTerms[solarTerms.length - 1].name; // 이전 년도 마지막 절기
  }

  // 절기 기준 월 계산
  static getSolarMonth(date: Date): number {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // 절기 기준일 (입춘 기준)
    const solarMonthStart = [
      { month: 2, day: 4 }, // 1월 (입춘)
      { month: 3, day: 5 }, // 2월 (경칩)
      { month: 4, day: 5 }, // 3월 (청명)
      { month: 5, day: 5 }, // 4월 (입하)
      { month: 6, day: 6 }, // 5월 (망종)
      { month: 7, day: 7 }, // 6월 (소서)
      { month: 8, day: 8 }, // 7월 (입추)
      { month: 9, day: 8 }, // 8월 (백로)
      { month: 10, day: 8 }, // 9월 (한로)
      { month: 11, day: 7 }, // 10월 (입동)
      { month: 12, day: 7 }, // 11월 (대설)
      { month: 13, day: 5 }, // 12월 (다음해 소한)
    ];

    for (let i = 0; i < solarMonthStart.length - 1; i++) {
      const start = solarMonthStart[i];
      const end = solarMonthStart[i + 1];

      if (month < start.month || (month === start.month && day < start.day)) {
        return i === 0 ? 12 : i; // 이전 년도 12월 또는 현재 월
      }

      if (
        month === start.month &&
        day >= start.day &&
        (month < end.month || (month === end.month && day < end.day))
      ) {
        return i + 1;
      }
    }

    return 12;
  }
}
