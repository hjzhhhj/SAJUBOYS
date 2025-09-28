export class SajuAdvancedInterpreter {
  // 십신(十神) 관계 분석
  static TEN_GODS = {
    비견: {
      meaning: '형제, 동료, 경쟁',
      positive: '협동심, 독립심',
      negative: '경쟁심, 고집',
    },
    겁재: {
      meaning: '경쟁자, 라이벌',
      positive: '추진력, 도전정신',
      negative: '충동성, 탈취',
    },
    식신: {
      meaning: '재능, 예술',
      positive: '창의성, 표현력',
      negative: '나태함, 과시',
    },
    상관: {
      meaning: '반항, 비판',
      positive: '개혁성, 독창성',
      negative: '반항심, 비판적',
    },
    편재: {
      meaning: '부업, 투자',
      positive: '사업수완, 융통성',
      negative: '투기성, 불안정',
    },
    정재: {
      meaning: '정당한 재물',
      positive: '성실함, 안정성',
      negative: '보수적, 인색함',
    },
    편관: {
      meaning: '도전, 변화',
      positive: '추진력, 결단력',
      negative: '충동적, 공격적',
    },
    정관: {
      meaning: '명예, 지위',
      positive: '책임감, 정직함',
      negative: '권위적, 경직성',
    },
    편인: {
      meaning: '학문, 종교',
      positive: '직관력, 영성',
      negative: '게으름, 의존성',
    },
    정인: {
      meaning: '어머니, 교육',
      positive: '인자함, 보호',
      negative: '과보호, 나약함',
    },
  };

  // 합충형파해 관계
  static COMBINATIONS = {
    천간합: {
      갑기: { element: '토', meaning: '중정지합 - 신뢰와 화합' },
      을경: { element: '금', meaning: '인의지합 - 의리와 정의' },
      병신: { element: '수', meaning: '위엄지합 - 권위와 품위' },
      정임: { element: '목', meaning: '인수지합 - 자비와 포용' },
      무계: { element: '화', meaning: '무정지합 - 열정과 변화' },
    },
    지지삼합: {
      인오술: { element: '화', meaning: '화국 - 열정과 활력' },
      신자진: { element: '수', meaning: '수국 - 지혜와 유연성' },
      사유축: { element: '금', meaning: '금국 - 결단력과 실행력' },
      해묘미: { element: '목', meaning: '목국 - 성장과 발전' },
    },
    지지육합: {
      자축: '토 - 안정과 실용',
      인해: '목 - 인정과 배려',
      묘술: '화 - 열정과 충성',
      진유: '금 - 변화와 혁신',
      사신: '수 - 지략과 계획',
      오미: '태양/태음 - 조화와 균형',
    },
    충: {
      자오: '수화충 - 감정과 이성의 충돌',
      축미: '토토충 - 보수와 진보의 대립',
      인신: '목금충 - 시작과 완성의 갈등',
      묘유: '목금충 - 부드러움과 강함의 대립',
      진술: '토토충 - 현실과 이상의 충돌',
      사해: '화수충 - 열정과 냉정의 대립',
    },
  };

  // 대운 흐름별 상세 해석
  static DAEUN_INTERPRETATIONS = {
    childhood: {
      목: '활발하고 호기심 많은 어린 시절. 학습 능력이 뛰어나고 새로운 것에 대한 도전 정신이 강함.',
      화: '밝고 명랑한 어린 시절. 예술적 재능과 표현력이 발달하며 주목받기를 좋아함.',
      토: '안정적이고 차분한 어린 시절. 현실적이고 실용적인 사고를 일찍부터 발달시킴.',
      금: '규칙적이고 체계적인 어린 시절. 정의감이 강하고 원칙을 중시하는 성향 발달.',
      수: '유연하고 적응력 좋은 어린 시절. 상상력이 풍부하고 창의적인 사고 발달.',
    },
    youth: {
      목: '성장과 도전의 시기. 학업이나 커리어에서 큰 발전이 예상되며 적극적인 활동이 유리.',
      화: '열정과 로맨스의 시기. 인간관계가 활발해지고 창의적인 활동에서 성과를 거둠.',
      토: '안정과 기반 구축의 시기. 실질적인 성과를 쌓고 장기적인 계획을 세우기 좋음.',
      금: '결단과 실행의 시기. 중요한 결정을 내리고 목표를 향해 과감히 전진하기 좋음.',
      수: '학습과 탐구의 시기. 새로운 지식을 습득하고 다양한 경험을 쌓기 좋음.',
    },
    middle: {
      목: '사업 확장과 성장의 시기. 리더십을 발휘하고 큰 프로젝트를 추진하기 좋음.',
      화: '명성과 인정의 시기. 사회적 지위가 상승하고 대외 활동이 활발해짐.',
      토: '안정과 축적의 시기. 재산 형성과 가정의 안정을 도모하기 좋음.',
      금: '권위와 성취의 시기. 전문성을 인정받고 중요한 직책을 맡게 됨.',
      수: '지혜와 통찰의 시기. 경험을 바탕으로 후진 양성과 컨설팅 활동이 유리.',
    },
    senior: {
      목: '새로운 시작과 제2의 인생. 은퇴 후에도 활발한 활동과 새로운 도전 가능.',
      화: '활력 있는 노년. 취미 활동과 봉사 활동을 통해 삶의 의미를 찾음.',
      토: '편안하고 안정적인 노년. 가족과 함께 평화로운 시간을 보냄.',
      금: '존경받는 노년. 인생 경험을 바탕으로 조언자 역할을 수행.',
      수: '지혜로운 노년. 정신적 수양과 철학적 탐구에 몰두.',
    },
  };

  // 궁합 분석
  static analyzeCompatibility(
    person1FourPillars: any,
    person2FourPillars: any,
  ): string {
    let compatibility = 0;
    let analysis = '궁합 분석:\n\n';

    // 일간 궁합 체크
    const p1Day = person1FourPillars.day.heaven;
    const p2Day = person2FourPillars.day.heaven;

    // 천간합 체크
    const combination = this.checkHeavenlyCombination(p1Day, p2Day);
    if (combination) {
      compatibility += 30;
      analysis += `일간 천간합: ${combination}\n`;
    }

    // 오행 상생 체크
    const relation = this.checkElementRelation(p1Day, p2Day);
    compatibility += relation.score;
    analysis += `오행 관계: ${relation.description}\n`;

    // 음양 조화 체크
    const yinYangBalance = this.checkYinYangBalance(
      person1FourPillars,
      person2FourPillars,
    );
    compatibility += yinYangBalance.score;
    analysis += `음양 조화: ${yinYangBalance.description}\n`;

    analysis += `\n전체 궁합도: ${compatibility}%\n`;

    if (compatibility >= 80) {
      analysis += '천생연분! 서로를 완벽하게 보완하는 관계입니다.';
    } else if (compatibility >= 60) {
      analysis +=
        '좋은 궁합입니다. 서로 노력하면 행복한 관계를 유지할 수 있습니다.';
    } else if (compatibility >= 40) {
      analysis += '보통 궁합입니다. 서로의 차이를 인정하고 배려가 필요합니다.';
    } else {
      analysis +=
        '노력이 필요한 궁합입니다. 서로를 이해하려는 노력이 중요합니다.';
    }

    return analysis;
  }

  // 천간 조합 체크
  static checkHeavenlyCombination(stem1: string, stem2: string): string | null {
    const combinations = [
      ['갑', '기'],
      ['을', '경'],
      ['병', '신'],
      ['정', '임'],
      ['무', '계'],
    ];

    for (const [a, b] of combinations) {
      if ((stem1 === a && stem2 === b) || (stem1 === b && stem2 === a)) {
        const key = stem1 < stem2 ? `${stem1}${stem2}` : `${stem2}${stem1}`;
        return this.COMBINATIONS.천간합[key]?.meaning || null;
      }
    }
    return null;
  }

  // 오행 관계 분석
  static checkElementRelation(
    stem1: string,
    stem2: string,
  ): { score: number; description: string } {
    const elementMap = {
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
    };

    const e1 = elementMap[stem1];
    const e2 = elementMap[stem2];

    const generating = {
      목: '화',
      화: '토',
      토: '금',
      금: '수',
      수: '목',
    };

    const controlling = {
      목: '토',
      토: '수',
      수: '화',
      화: '금',
      금: '목',
    };

    if (generating[e1] === e2) {
      return {
        score: 20,
        description: `${e1}이(가) ${e2}를 생(生)하는 상생 관계`,
      };
    } else if (generating[e2] === e1) {
      return {
        score: 20,
        description: `${e2}이(가) ${e1}를 생(生)하는 상생 관계`,
      };
    } else if (controlling[e1] === e2) {
      return {
        score: -10,
        description: `${e1}이(가) ${e2}를 극(剋)하는 상극 관계`,
      };
    } else if (controlling[e2] === e1) {
      return {
        score: -10,
        description: `${e2}이(가) ${e1}를 극(剋)하는 상극 관계`,
      };
    } else if (e1 === e2) {
      return { score: 15, description: `같은 ${e1} 오행으로 비화 관계` };
    }

    return { score: 10, description: '중립적 관계' };
  }

  // 음양 균형 체크
  static checkYinYangBalance(
    pillars1: any,
    pillars2: any,
  ): { score: number; description: string } {
    const yangStems = ['갑', '병', '무', '경', '임'];
    const isYang1 = yangStems.includes(pillars1.day.heaven);
    const isYang2 = yangStems.includes(pillars2.day.heaven);

    if (isYang1 !== isYang2) {
      return { score: 30, description: '음양이 조화를 이루어 균형잡힌 관계' };
    } else if (isYang1 && isYang2) {
      return { score: 15, description: '둘 다 양(陽)의 기운으로 활발한 관계' };
    } else {
      return {
        score: 15,
        description: '둘 다 음(陰)의 기운으로 안정적인 관계',
      };
    }
  }

  // 띠별 운세와 성격
  static ZODIAC_INTERPRETATIONS = {
    자: {
      animal: '쥐',
      personality:
        '영리하고 재치있으며 적응력이 뛰어남. 기회를 잘 포착하고 경제관념이 발달.',
      career: '사업가, 금융인, 컨설턴트',
      compatibility: '용, 원숭이, 소와 궁합이 좋음',
    },
    축: {
      animal: '소',
      personality: '성실하고 인내심이 강함. 책임감이 있고 신뢰할 수 있는 성격.',
      career: '공무원, 교육자, 농업',
      compatibility: '뱀, 닭, 쥐와 궁합이 좋음',
    },
    인: {
      animal: '호랑이',
      personality: '용감하고 리더십이 강함. 정의감이 있고 도전정신이 뛰어남.',
      career: '군인, 경찰, CEO',
      compatibility: '말, 개, 돼지와 궁합이 좋음',
    },
    묘: {
      animal: '토끼',
      personality: '온화하고 예술적 감각이 뛰어남. 평화를 사랑하고 외교적.',
      career: '예술가, 외교관, 디자이너',
      compatibility: '양, 돼지, 개와 궁합이 좋음',
    },
    진: {
      animal: '용',
      personality: '카리스마가 있고 야망이 큼. 창의적이고 열정적인 성격.',
      career: '정치인, 사업가, 연예인',
      compatibility: '원숭이, 쥐, 닭과 궁합이 좋음',
    },
    사: {
      animal: '뱀',
      personality: '지혜롭고 신비로움. 직관력이 뛰어나고 심사숙고하는 성격.',
      career: '연구원, 심리학자, 탐정',
      compatibility: '닭, 소와 궁합이 좋음',
    },
    오: {
      animal: '말',
      personality: '자유분방하고 활동적. 사교성이 좋고 낙천적인 성격.',
      career: '영업, 여행가이드, 운동선수',
      compatibility: '호랑이, 개, 양과 궁합이 좋음',
    },
    미: {
      animal: '양',
      personality: '예술적이고 온순함. 창의력이 풍부하고 감수성이 예민.',
      career: '예술가, 작가, 요리사',
      compatibility: '토끼, 말, 돼지와 궁합이 좋음',
    },
    신: {
      animal: '원숭이',
      personality: '재치있고 다재다능함. 호기심이 많고 문제해결 능력이 뛰어남.',
      career: 'IT전문가, 발명가, 엔터테이너',
      compatibility: '용, 쥐와 궁합이 좋음',
    },
    유: {
      animal: '닭',
      personality: '꼼꼼하고 완벽주의적. 시간관념이 철저하고 근면성실.',
      career: '회계사, 의사, 법조인',
      compatibility: '소, 뱀, 용과 궁합이 좋음',
    },
    술: {
      animal: '개',
      personality: '충성스럽고 정직함. 정의감이 강하고 타인을 잘 돕는 성격.',
      career: '사회복지사, 의료인, 교육자',
      compatibility: '호랑이, 토끼, 말과 궁합이 좋음',
    },
    해: {
      animal: '돼지',
      personality: '순수하고 정이 많음. 낙천적이고 관대한 성격.',
      career: '요식업, 엔터테인먼트, 자선사업',
      compatibility: '토끼, 양, 호랑이와 궁합이 좋음',
    },
  };

  // 종합적인 고급 해석 생성
  static generateAdvancedInterpretation(
    fourPillars: any,
    elements: any,
    yinYang: any,
    birthDateTime: Date,
    gender: string,
  ): any {
    const yearBranch = fourPillars.year.earth;
    const zodiac = this.ZODIAC_INTERPRETATIONS[yearBranch];

    // 나이별 대운 분석
    const age = new Date().getFullYear() - birthDateTime.getFullYear();
    let ageGroup = 'youth';
    if (age < 20) ageGroup = 'childhood';
    else if (age < 40) ageGroup = 'youth';
    else if (age < 60) ageGroup = 'middle';
    else ageGroup = 'senior';

    // 지배 오행 찾기
    const dominantElement = Object.entries(elements).reduce(
      (max, [element, count]) =>
        (count as number) > max.count
          ? { element, count: count as number }
          : max,
      { element: '', count: 0 },
    ).element;

    const daeunInterpretation =
      this.DAEUN_INTERPRETATIONS[ageGroup][dominantElement] || '';

    // 십신 관계 분석 (간단 버전)
    const tenGodsAnalysis = this.analyzeTenGods(fourPillars);

    // 특별한 격국 체크
    const specialPattern = this.checkSpecialPattern(fourPillars, elements);

    return {
      zodiacSign: zodiac,
      daeunAnalysis: daeunInterpretation,
      tenGodsAnalysis,
      specialPattern,
      dominantElement,
    };
  }

  // 십신 분석 (간단 버전)
  static analyzeTenGods(fourPillars: any): string {
    const dayMaster = fourPillars.day.heaven;
    let analysis = '십신 분석:\n';

    // 간단한 십신 판단 로직
    const stems = [fourPillars.year.heaven, fourPillars.month.heaven];

    // 시주가 있을 때만 추가
    if (fourPillars.time) {
      stems.push(fourPillars.time.heaven);
    }

    const counts = {
      비견겁재: 0,
      식신상관: 0,
      재성: 0,
      관성: 0,
      인성: 0,
    };

    // 실제로는 더 복잡한 로직이 필요하지만, 간단하게 구현
    stems.forEach((stem) => {
      if (stem === dayMaster) counts.비견겁재++;
    });

    if (counts.비견겁재 > 1) {
      analysis += '비견/겁재가 많아 독립심과 경쟁심이 강합니다.\n';
    }

    return analysis;
  }

  // 특별한 격국 체크
  static checkSpecialPattern(fourPillars: any, elements: any): string {
    const total = Object.values(elements).reduce(
      (sum: number, count: any) => sum + count,
      0,
    );
    let pattern = '';

    // 가장 강한 오행과 가장 약한 오행 찾기
    const dominantElement = Object.entries(elements).reduce(
      (max, [element, count]) =>
        (count as number) > max.count
          ? { element, count: count as number }
          : max,
      { element: '', count: 0 },
    );

    const weakestElement = Object.entries(elements).reduce(
      (min, [element, count]) =>
        (count as number) < min.count && (count as number) > 0
          ? { element, count: count as number }
          : min,
      { element: '', count: 99 },
    );

    // 편중된 오행 체크
    Object.entries(elements).forEach(([element, count]: [string, any]) => {
      const percentage = ((count as number) / (total as number)) * 100;
      if (percentage >= 40) {
        pattern = `${element}이 매우 강한 특수 격국입니다. `;
        switch (element) {
          case '목':
            pattern +=
              '성장과 발전의 에너지가 매우 강하여 끊임없이 전진하는 인생입니다.';
            break;
          case '화':
            pattern += '밝고 화려한 인생으로 주목받는 위치에 서게 됩니다.';
            break;
          case '토':
            pattern += '중심을 잡고 안정을 추구하는 든든한 인생입니다.';
            break;
          case '금':
            pattern += '결단력과 추진력으로 목표를 달성하는 인생입니다.';
            break;
          case '수':
            pattern += '지혜와 유연성으로 변화에 적응하는 인생입니다.';
            break;
        }
      } else if (percentage >= 30) {
        pattern = `${element}의 기운이 강한 사주입니다. `;
        switch (element) {
          case '목':
            pattern +=
              '창의력과 성장 의지가 뛰어나 새로운 분야에서 성공할 가능성이 높습니다.';
            break;
          case '화':
            pattern +=
              '활력과 표현력이 뛰어나 사람들과의 관계에서 인기가 많습니다.';
            break;
          case '토':
            pattern += '신뢰성과 안정감으로 사람들의 중심 역할을 하게 됩니다.';
            break;
          case '금':
            pattern += '원칙과 의리를 중시하여 전문 분야에서 인정받게 됩니다.';
            break;
          case '수':
            pattern +=
              '깊이 있는 사고와 직관력으로 학문이나 예술 분야에서 재능을 발휘합니다.';
            break;
        }
      }
    });

    // 오행이 부족한 경우도 체크
    if (!pattern) {
      Object.entries(elements).forEach(([element, count]: [string, any]) => {
        const percentage = ((count as number) / (total as number)) * 100;
        if (percentage === 0) {
          pattern = `${element}이 전혀 없는 특수한 사주입니다. `;
          switch (element) {
            case '목':
              pattern +=
                '유연성과 성장력을 기르는 것이 중요하며, 학습과 도전을 통해 발전하게 됩니다.';
              break;
            case '화':
              pattern +=
                '활력과 열정을 기르는 것이 중요하며, 사회적 활동을 통해 성장하게 됩니다.';
              break;
            case '토':
              pattern +=
                '안정감과 신뢰성을 기르는 것이 중요하며, 꾸준함으로 성과를 이루게 됩니다.';
              break;
            case '금':
              pattern +=
                '결단력과 원칙을 세우는 것이 중요하며, 체계적 접근으로 성공하게 됩니다.';
              break;
            case '수':
              pattern +=
                '지혜와 통찰력을 기르는 것이 중요하며, 경험을 통해 성숙하게 됩니다.';
              break;
          }
        }
      });
    }

    return pattern || '균형잡힌 사주로 다양한 가능성이 열려있습니다.';
  }

  // 시기별 상세 운세
  static async generateTimelyFortune(
    fourPillars: any,
    currentYear: number,
    elements?: any,
    yinYang?: any,
    gender?: string,
  ): Promise<any> {
    const yearlyFortune = {
      overall: '',
      love: '',
      career: '',
      wealth: '',
      health: '',
      advice: '',
    };

    // 올해의 천간지지
    const yearIndex = (currentYear - 4) % 60;
    const heavenlyIndex = yearIndex % 10;
    const earthlyIndex = yearIndex % 12;

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

    const thisYearStem = heavenlyStems[heavenlyIndex];
    const thisYearBranch = earthlyBranches[earthlyIndex];

    // 일간과 올해 천간의 관계
    const dayMaster = fourPillars.day.heaven;
    const combination = this.checkHeavenlyCombination(dayMaster, thisYearStem);

    if (combination) {
      yearlyFortune.overall = `올해는 ${combination}의 해로 좋은 기회가 많이 찾아옵니다.`;
      yearlyFortune.love = '인연이 깊어지고 좋은 만남이 기대됩니다.';
      yearlyFortune.career =
        '협력과 파트너십을 통해 큰 성과를 얻을 수 있습니다.';
    } else {
      yearlyFortune.overall = '평년 수준의 운세로 꾸준한 노력이 중요합니다.';
      yearlyFortune.love = '기존 관계를 돈독히 하는 것이 중요합니다.';
      yearlyFortune.career = '실력을 쌓고 기반을 다지는 시기입니다.';
    }

    yearlyFortune.wealth = '계획적인 소비와 저축이 필요한 시기입니다.';
    yearlyFortune.health = '규칙적인 생활습관과 운동이 중요합니다.';

    // 개인의 일간과 올해 천간의 관계를 고려해 맞춤형 조언!
    const personalAdvice = await this.getPersonalizedAdvice(
      dayMaster,
      thisYearStem,
      thisYearBranch,
      elements,
      yinYang,
      fourPillars,
      currentYear,
      gender,
    );
    yearlyFortune.advice = personalAdvice;

    return yearlyFortune;
  }

  // 개인화된 맞춤형 조언 생성 (AI 기반으로 완전히 변경)
  static async getPersonalizedAdvice(
    dayMaster: string,
    yearStem: string,
    yearBranch: string,
    elements?: any,
    yinYang?: any,
    fourPillars?: any,
    currentYear?: number,
    gender?: string,
  ): Promise<string> {
    const dayElement = this.getElementFromStem(dayMaster);
    const yearElement = this.getElementFromStem(yearStem);
    const relationship = this.getFiveElementsRelationship(
      dayElement,
      yearElement,
    );

    // AI 기반 조언이 가능한 경우
    if (fourPillars && currentYear && gender && elements && yinYang) {
      try {
        const apiKey = process.env.GEMINI_API_KEY || '';

        const yearIndex = (currentYear - 4) % 60;
        const heavenlyIndex = yearIndex % 10;
        const earthlyIndex = yearIndex % 12;

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

        const thisYearStem = heavenlyStems[heavenlyIndex];
        const thisYearBranch = earthlyBranches[earthlyIndex];

        let relationshipDesc = '';
        if (relationship === 'supportive') {
          relationshipDesc = '상생 관계 (도움을 주는 좋은 관계)';
        } else if (relationship === 'conflicting') {
          relationshipDesc = '상극 관계 (충돌하는 어려운 관계)';
        } else {
          relationshipDesc = '중립 관계 (특별한 영향이 없는 평범한 관계)';
        }

        const prompt = `당신은 30년 경력의 전문 사주 명리 상담가입니다. 아래 개인 정보를 바탕으로 ${currentYear}년 한 해 동안 사용자가 바로 실천할 수 있는 "행동 가이드"를 간결하게 작성하세요.

## 개인 정보
- 일주(본인): ${fourPillars.day.heaven}${fourPillars.day.earth} (${dayElement})
- 년주: ${fourPillars.year.heaven}${fourPillars.year.earth}
- 월주: ${fourPillars.month.heaven}${fourPillars.month.earth}
${fourPillars.time ? `- 시주: ${fourPillars.time.heaven}${fourPillars.time.earth}` : '- 시주: 미상'}
- 오행 분포: 목(${elements.목}) 화(${elements.화}) 토(${elements.토}) 금(${elements.금}) 수(${elements.수})
- 음양 분포: 음(${yinYang.yin}) 양(${yinYang.yang})
- 성별: ${gender}
- 올해: ${currentYear}년 ${thisYearStem}${thisYearBranch}년
- 일주와 올해의 관계: ${relationshipDesc}

## 작성 규칙
- 일주 오행(${dayElement})과 올해 오행(${yearElement})의 관계(${relationshipDesc})를 반영하여 조언을 작성하세요.
- ${relationship === 'supportive' ? '상생 관계이므로 적극적으로 도전하고 기회를 잡는 것이 좋습니다.' : relationship === 'conflicting' ? '상극 관계이므로 신중하게 행동하고 무리하지 않는 것이 중요합니다.' : '중립 관계이므로 기본을 탄탄히 하고 균형을 유지하는 것이 중요합니다.'}
- 각 항목은 1~2문장, 모두 **명령형("~하세요/피하세요")**으로 작성.
- 일반인이 바로 실행 가능한 구체적 행동으로만 작성.
- 아래 용어 **절대 사용 금지**: 전문용어(천간, 지지, 합충, 상생, 상극 등)와 그 유사 표현.
- 오행 분포에서 과하거나 부족한 요소를 고려해 **맞춤형으로** 작성.
- 총 5개 항목 고정: "좋은 것 3개 + 조심할 것 2개".
- **반드시 JSON 형식으로만 출력**하세요. 다른 설명, 머리말/꼬리말, 마크다운 코드블록 금지.

## 출력 형식(이 JSON 형식을 그대로 사용)
{
  "good": [
    "구체적인 행동 1",
    "구체적인 행동 2",
    "구체적인 행동 3"
  ],
  "caution": [
    "주의사항 1",
    "주의사항 2"
  ]
}`;

        // Gemini REST API 직접 호출
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Gemini API 오류 응답:', errorText);
          throw new Error(`Gemini API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Gemini API 응답:', JSON.stringify(data, null, 2));
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data);

        // JSON 추출 (마크다운 코드블록 제거)
        let jsonText = text.trim();
        if (jsonText.startsWith('```json')) {
          jsonText = jsonText.replace(/```json\s*/, '').replace(/```\s*$/, '');
        } else if (jsonText.startsWith('```')) {
          jsonText = jsonText.replace(/```\s*/, '').replace(/```\s*$/, '');
        }

        const aiResult = JSON.parse(jsonText);

        let advice = '**✅ 이렇게 하면 좋습니다:**\n';
        advice += (aiResult.good || [])
          .map((item: string, i: number) => `${i + 1}. ${item}`)
          .join('\n');
        advice += '\n\n**⚠️ 이런 것은 조심하세요:**\n';
        advice += (aiResult.caution || [])
          .map((item: string, i: number) => `${i + 1}. ${item}`)
          .join('\n');

        return advice;
      } catch (error) {
        console.error('AI 조언 생성 실패, 기본 조언으로 폴백:', error);
      }
    }

    // AI 실패 시 또는 파라미터 부족 시 에러 메시지
    return '맞춤형 행동 가이드를 생성할 수 없습니다. 나중에 다시 시도해주세요.';
  }

  // 상생 관계일 때의 조언
  static getSupportiveAdvice(
    dayElement: string,
    yearElement: string,
  ): { good: string[]; caution: string[] } {
    const adviceMap: {
      [key: string]: { [key: string]: { good: string[]; caution: string[] } };
    } = {
      목: {
        수: {
          good: [
            '새로운 프로젝트나 학습을 시작하세요. 성장의 에너지가 강한 시기입니다.',
            '인맥 관리에 집중하세요. 좋은 사람들과의 만남이 큰 도움이 됩니다.',
            '창의적인 아이디어를 실행에 옮기세요. 상상이 현실이 되는 해입니다.',
          ],
          caution: [
            '너무 많은 일을 동시에 벌이지 마세요. 우선순위를 정해 집중하세요.',
            '급한 마음에 서두르지 마세요. 차근차근 진행하는 것이 중요합니다.',
          ],
        },
      },
      화: {
        목: {
          good: [
            '사회활동과 네트워킹을 활발히 하세요. 인정받을 기회가 많습니다.',
            '표현력을 발휘할 수 있는 일에 도전하세요. 당신의 열정이 빛을 발합니다.',
            '새로운 취미나 관심사를 개발하세요. 삶에 활력이 더해집니다.',
          ],
          caution: [
            '감정적인 결정을 피하세요. 중요한 일은 충분히 생각한 후 결정하세요.',
            '체력 관리를 소홀히 하지 마세요. 너무 많은 활동은 건강을 해칠 수 있습니다.',
          ],
        },
      },
      토: {
        화: {
          good: [
            '장기적인 계획을 세우고 차근차근 실행하세요. 안정된 성과를 기대할 수 있습니다.',
            '부동산이나 저축 등 자산 관리에 신경 쓰세요. 재산 형성의 좋은 시기입니다.',
            '주변 사람들과의 관계를 돈독히 하세요. 신뢰가 큰 자산이 됩니다.',
          ],
          caution: [
            '변화를 두려워하지 마세요. 지나친 안정 추구는 기회를 놓칠 수 있습니다.',
            '고집을 부리지 마세요. 다른 의견에도 귀 기울이세요.',
          ],
        },
      },
      금: {
        토: {
          good: [
            '전문성을 키우는 데 투자하세요. 자격증이나 교육이 큰 도움이 됩니다.',
            '명확한 목표를 세우고 실행하세요. 결단력있는 행동이 성공을 부릅니다.',
            '규칙적인 생활 습관을 유지하세요. 건강과 성과 모두를 얻을 수 있습니다.',
          ],
          caution: [
            '지나치게 엄격하지 마세요. 융통성도 필요합니다.',
            '완벽주의를 조심하세요. 80%의 완성도로도 충분할 때가 많습니다.',
          ],
        },
      },
      수: {
        금: {
          good: [
            '새로운 지식과 정보를 습득하세요. 학습이 큰 기회로 연결됩니다.',
            '유연하게 상황에 대처하세요. 변화를 두려워하지 말고 받아들이세요.',
            '직관을 믿으세요. 당신의 판단력이 빛을 발하는 시기입니다.',
          ],
          caution: [
            '우유부단하지 마세요. 결정이 필요할 때는 과감히 선택하세요.',
            '지나친 걱정을 피하세요. 긍정적인 마인드를 유지하세요.',
          ],
        },
      },
    };

    return adviceMap[dayElement]?.[yearElement] || this.getDefaultAdvice();
  }

  // 상극 관계일 때의 조언
  static getConflictingAdvice(
    dayElement: string,
    yearElement: string,
  ): { good: string[]; caution: string[] } {
    const adviceMap: {
      [key: string]: { [key: string]: { good: string[]; caution: string[] } };
    } = {
      목: {
        금: {
          good: [
            '인내심을 가지고 꾸준히 노력하세요. 시련을 극복하면 더 강해집니다.',
            '자기 계발에 투자하세요. 내실을 다지는 시기로 활용하세요.',
            '신뢰할 수 있는 사람들과 협력하세요. 혼자보다 함께가 힘이 됩니다.',
          ],
          caution: [
            '충동적인 결정을 피하세요. 중요한 일은 신중히 판단하세요.',
            '건강 관리에 특히 신경 쓰세요. 스트레스 관리가 중요합니다.',
          ],
        },
      },
      화: {
        수: {
          good: [
            '차분하게 계획을 세우고 실행하세요. 서두르지 말고 단계적으로 진행하세요.',
            '감정 조절에 신경 쓰세요. 명상이나 운동으로 마음의 평화를 유지하세요.',
            '작은 목표부터 달성하세요. 성취감이 동기부여가 됩니다.',
          ],
          caution: [
            '감정적 소비를 조심하세요. 충동구매보다는 계획적인 소비를 하세요.',
            '타인과의 갈등을 피하세요. 말을 신중히 선택하세요.',
          ],
        },
      },
      토: {
        목: {
          good: [
            '변화에 유연하게 대처하세요. 새로운 시도를 두려워하지 마세요.',
            '운동이나 스트레칭으로 몸을 유연하게 유지하세요. 건강이 중요합니다.',
            '다양한 의견을 경청하세요. 열린 마음이 기회를 가져옵니다.',
          ],
          caution: [
            '고집을 버리세요. 때로는 타협도 필요합니다.',
            '지나친 걱정을 피하세요. 일어나지 않은 일에 에너지를 소비하지 마세요.',
          ],
        },
      },
      금: {
        화: {
          good: [
            '온화한 태도를 유지하세요. 부드러운 접근이 더 큰 효과를 냅니다.',
            '휴식과 재충전의 시간을 가지세요. 무리하지 말고 여유를 찾으세요.',
            '예술이나 문화 활동을 즐기세요. 감성을 채우는 시간이 필요합니다.',
          ],
          caution: [
            '지나치게 완벽을 추구하지 마세요. 적당한 선에서 만족하세요.',
            '비판적인 태도를 조심하세요. 긍정적인 시각을 유지하세요.',
          ],
        },
      },
      수: {
        토: {
          good: [
            '적극적으로 행동하세요. 망설임보다는 실행이 중요합니다.',
            '규칙적인 생활 패턴을 만드세요. 안정된 루틴이 도움이 됩니다.',
            '목표를 구체화하세요. 명확한 방향성이 성과를 만듭니다.',
          ],
          caution: [
            '우유부단함을 경계하세요. 결정할 때는 과감하게 하세요.',
            '지나친 사고를 피하세요. 때로는 직관을 따르는 것도 필요합니다.',
          ],
        },
      },
    };

    return adviceMap[dayElement]?.[yearElement] || this.getDefaultAdvice();
  }

  // 중립 관계일 때의 조언 - AI 기반
  static async getNeutralAdvice(
    dayElement: string,
    yearElement: string,
    fourPillars: any,
    elements: any,
    yinYang: any,
    currentYear: number,
    gender: string,
  ): Promise<{ good: string[]; caution: string[] }> {
    try {
      const apiKey = process.env.GEMINI_API_KEY || '';

      const yearIndex = (currentYear - 4) % 60;
      const heavenlyIndex = yearIndex % 10;
      const earthlyIndex = yearIndex % 12;

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

      const thisYearStem = heavenlyStems[heavenlyIndex];
      const thisYearBranch = earthlyBranches[earthlyIndex];

      const prompt = `당신은 30년 경력의 전문 사주 명리 상담가입니다. 아래 개인 정보를 바탕으로 ${currentYear}년 한 해 동안 사용자가 바로 실천할 수 있는 "행동 가이드"를 간결하게 작성하세요.

## 개인 정보
- 일주(본인): ${fourPillars.day.heaven}${fourPillars.day.earth} (${dayElement})
- 년주: ${fourPillars.year.heaven}${fourPillars.year.earth}
- 월주: ${fourPillars.month.heaven}${fourPillars.month.earth}
${fourPillars.time ? `- 시주: ${fourPillars.time.heaven}${fourPillars.time.earth}` : '- 시주: 미상'}
- 오행 분포: 목(${elements.목}) 화(${elements.화}) 토(${elements.토}) 금(${elements.금}) 수(${elements.수})
- 음양 분포: 음(${yinYang.yin}) 양(${yinYang.yang})
- 성별: ${gender}
- 올해: ${currentYear}년 ${thisYearStem}${thisYearBranch}년 (일주 오행과 중립 관계)

## 작성 규칙
- 일주 오행(${dayElement})과 올해 오행(${yearElement})이 중립 관계이므로, 안정적이지만 특별한 운이 없는 평범한 해입니다.
- 이런 해에는 기본을 탄탄히 하고, 부족한 오행을 보완하며, 과한 오행을 조절하는 것이 중요합니다.
- 각 항목은 1~2문장, 모두 **명령형("~하세요/피하세요")**으로 작성.
- 일반인이 바로 실행 가능한 구체적 행동으로만 작성.
- 아래 용어 **절대 사용 금지**: 전문용어(천간, 지지, 합충, 상생, 상극 등)와 그 유사 표현.
- 오행 분포에서 과하거나 부족한 요소를 고려해 **맞춤형으로** 작성.
- 총 5개 항목 고정: "좋은 것 3개 + 조심할 것 2개".
- **반드시 JSON 형식으로만 출력**하세요. 다른 설명, 머리말/꼬리말, 마크다운 코드블록 금지.

## 출력 형식(이 JSON 형식을 그대로 사용)
{
  "good": [
    "구체적인 행동 1",
    "구체적인 행동 2",
    "구체적인 행동 3"
  ],
  "caution": [
    "주의사항 1",
    "주의사항 2"
  ]
}`;

      // Gemini REST API 직접 호출
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;

      // JSON 추출 (마크다운 코드블록 제거)
      let jsonText = text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\s*/, '').replace(/```\s*$/, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\s*/, '').replace(/```\s*$/, '');
      }

      const aiResult = JSON.parse(jsonText);

      return {
        good: aiResult.good || [],
        caution: aiResult.caution || [],
      };
    } catch (error) {
      console.error('AI 조언 생성 실패:', error);
      return this.getDefaultAdvice();
    }
  }

  // 기본 조언 (AI 실패 시 사용 - 빈 배열 반환)
  static getDefaultAdvice(): { good: string[]; caution: string[] } {
    return {
      good: [],
      caution: [],
    };
  }

  // 오행 균형에 따른 추가 조언
  static getElementBalanceAdvice(elements: any): string {
    const total = Object.values(elements).reduce(
      (sum: number, val: any) => sum + val,
      0,
    ) as number;

    // 가장 부족한 오행 찾기
    const minElement = Object.entries(elements).reduce(
      (min, [elem, count]) =>
        (count as number) < min.count
          ? { element: elem, count: count as number }
          : min,
      { element: '', count: 10 },
    );

    // 가장 강한 오행 찾기
    const maxElement = Object.entries(elements).reduce(
      (max, [elem, count]) =>
        (count as number) > max.count
          ? { element: elem, count: count as number }
          : max,
      { element: '', count: 0 },
    );

    const elementAdviceMap: { [key: string]: string } = {
      목: '녹색 계열 옷이나 소품을 활용하고, 식물을 키우거나 산책을 즐기세요.',
      화: '밝은 색상의 옷을 입고, 사람들과의 만남을 즐기며 활동적으로 지내세요.',
      토: '황색이나 갈색 계열을 활용하고, 안정된 환경에서 꾸준히 노력하세요.',
      금: '흰색이나 금색 계열을 활용하고, 규칙적이고 체계적인 생활을 하세요.',
      수: '검은색이나 파란색 계열을 활용하고, 충분한 휴식과 수분 섭취를 하세요.',
    };

    if (minElement.count === 0) {
      return `${minElement.element}의 기운이 부족합니다. ${elementAdviceMap[minElement.element]}`;
    } else if (maxElement.count / total > 0.4) {
      // 한 오행이 40% 이상이면 과다
      const oppositeAdvice: { [key: string]: string } = {
        목: '지나친 성급함을 조심하세요. 차분하게 생각하고 행동하세요.',
        화: '과도한 활동을 자제하세요. 휴식과 재충전의 시간을 가지세요.',
        토: '지나친 안정만 추구하지 마세요. 때로는 변화도 필요합니다.',
        금: '너무 엄격하지 마세요. 여유와 융통성을 가지세요.',
        수: '지나친 사고를 줄이세요. 행동으로 옮기는 실행력을 키우세요.',
      };
      return oppositeAdvice[maxElement.element] || '';
    }

    return '';
  }

  // 천간에서 오행 추출
  static getElementFromStem(stem: string): string {
    const stemElements: { [key: string]: string } = {
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
    };
    return stemElements[stem] || '목';
  }

  // 오행 관계 판단 (상생/상극/기타)
  static getFiveElementsRelationship(
    element1: string,
    element2: string,
  ): string {
    // 상생 관계: 목→화→토→금→수→목
    const supportive: { [key: string]: string } = {
      목: '화',
      화: '토',
      토: '금',
      금: '수',
      수: '목',
    };

    // 상극 관계: 목→토, 화→금, 토→수, 금→목, 수→화
    const conflicting: { [key: string]: string } = {
      목: '토',
      화: '금',
      토: '수',
      금: '목',
      수: '화',
    };

    if (
      supportive[element1] === element2 ||
      supportive[element2] === element1
    ) {
      return 'supportive';
    } else if (
      conflicting[element1] === element2 ||
      conflicting[element2] === element1
    ) {
      return 'conflicting';
    } else {
      return 'neutral';
    }
  }

}
