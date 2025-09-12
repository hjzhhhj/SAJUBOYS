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
  static generateTimelyFortune(fourPillars: any, currentYear: number): any {
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
    const personalAdvice = this.getPersonalizedAdvice(
      dayMaster,
      thisYearStem,
      thisYearBranch,
    );
    yearlyFortune.advice = personalAdvice;

    return yearlyFortune;
  }

  // 개인화된 맞춤형 조언 생성
  static getPersonalizedAdvice(
    dayMaster: string,
    yearStem: string,
    yearBranch: string,
  ): string {
    // 일간과 년간의 오행 관계 분석
    const dayElement = this.getElementFromStem(dayMaster);
    const yearElement = this.getElementFromStem(yearStem);

    // 상생/상극 관계 판단
    const relationship = this.getFiveElementsRelationship(
      dayElement,
      yearElement,
    );

    let advice = `${yearStem}${yearBranch}년은 `;

    if (relationship === 'supportive') {
      advice += `당신의 ${dayElement} 기운을 강화시켜주는 ${yearElement}의 해입니다. `;
      switch (dayElement) {
        case '목':
          advice +=
            '성장과 발전에 집중하여 새로운 도전을 시도하기 좋은 해입니다.';
          break;
        case '화':
          advice += '열정과 창의력을 발휘하여 큰 성과를 이룰 수 있는 해입니다.';
          break;
        case '토':
          advice += '안정된 기반 위에서 꾸준한 성과를 쌓아가기 좋은 해입니다.';
          break;
        case '금':
          advice += '결단력과 추진력으로 목표를 달성하기 좋은 해입니다.';
          break;
        case '수':
          advice +=
            '지혜와 유연성을 바탕으로 변화에 적응하며 발전하기 좋은 해입니다.';
          break;
      }
    } else if (relationship === 'conflicting') {
      advice += `당신의 ${dayElement} 기운과 상극인 ${yearElement}의 해입니다. `;
      advice += '신중하게 행동하되 이 시기를 통해 더욱 성숙해질 수 있습니다. ';
      switch (dayElement) {
        case '목':
          advice +=
            '인내심을 갖고 꾸준히 노력하면 오히려 더 큰 성장을 이룰 수 있습니다.';
          break;
        case '화':
          advice +=
            '차분함을 유지하며 계획적으로 행동하면 좋은 결과를 얻을 수 있습니다.';
          break;
        case '토':
          advice +=
            '유연성을 기르고 변화에 적응하려 노력하면 새로운 기회를 얻을 수 있습니다.';
          break;
        case '금':
          advice +=
            '온화함과 포용력을 기르면 대인관계에서 큰 도움이 될 것입니다.';
          break;
        case '수':
          advice +=
            '적극성과 행동력을 기르면 정체된 상황을 돌파할 수 있습니다.';
          break;
      }
    } else {
      advice += `당신의 ${dayElement} 기운과 조화로운 ${yearElement}의 해입니다. `;
      advice += '균형을 유지하며 다방면으로 발전할 수 있는 좋은 시기입니다.';
    }

    return advice;
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
