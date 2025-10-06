export class SajuAdvancedInterpreter {
  // 올해 운세 생성
  static async generateTimelyFortune(
    fourPillars: any,
    currentYear: number,
    elements?: any,
    yinYang?: any,
    gender?: string,
  ): Promise<any> {
    const dayMaster = fourPillars.day.heaven;
    const thisYearStem = this.getYearStem(currentYear);
    const thisYearBranch = this.getYearBranch(currentYear);

    const yearlyFortune = {
      overall: this.getYearlyOverallFortune(dayMaster, thisYearStem),
      love: this.getLoveFortune(dayMaster, thisYearBranch),
      wealth: this.getWealthFortune(dayMaster, thisYearStem),
      health: this.getHealthFortune(dayMaster, elements),
      advice: '',
    };

    // AI 기반 맞춤형 조언 생성
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

  // 년도에서 천간 얻기
  static getYearStem(year: number): string {
    const stems = ['경', '신', '임', '계', '갑', '을', '병', '정', '무', '기'];
    return stems[year % 10];
  }

  // 년도에서 지지 얻기
  static getYearBranch(year: number): string {
    const branches = [
      '신',
      '유',
      '술',
      '해',
      '자',
      '축',
      '인',
      '묘',
      '진',
      '사',
      '오',
      '미',
    ];
    return branches[year % 12];
  }

  // 연간 전체 운세 (십성 기반)
  static getYearlyOverallFortune(dayMaster: string, yearStem: string): string {
    const dayElement = this.getElementFromStem(dayMaster);
    const yearElement = this.getElementFromStem(yearStem);
    const relationship = this.getFiveElementsRelationship(
      dayElement,
      yearElement,
    );

    // 십성(十星) 계산 - 일간과 세운 천간의 관계
    const sipseong = this.getSipseong(dayMaster, yearStem);

    let fortune = '';

    // 십성에 따른 해석
    switch (sipseong) {
      case '비겁':
        fortune =
          '올해는 형제, 친구, 동료와의 인연이 강한 해입니다. 협력과 경쟁이 동시에 일어날 수 있으며, 독립심과 자립심이 강해집니다. 재물 관리에 주의가 필요하며, 과도한 지출을 자제하세요.';
        break;
      case '식상':
        fortune =
          '올해는 표현력과 창의력이 빛나는 해입니다. 새로운 아이디어가 샘솟고 자유로운 활동이 많아집니다. 학업, 창작, 사업 확장에 유리하나, 말조심과 감정 조절이 필요합니다.';
        break;
      case '재성':
        fortune =
          '올해는 재물운이 좋은 해입니다. 수입 증가의 기회가 있으며, 투자나 사업에서 성과를 거둘 수 있습니다. 다만 과욕을 부리지 말고, 아버지나 배우자 건강에도 신경 쓰세요.';
        break;
      case '관성':
        fortune =
          '올해는 명예와 지위가 상승하는 해입니다. 승진, 합격, 인정받을 기회가 많습니다. 책임감이 커지고 리더십을 발휘할 수 있으나, 스트레스와 압박감도 증가하니 건강 관리가 중요합니다.';
        break;
      case '인성':
        fortune =
          '올해는 학습과 성장에 좋은 해입니다. 스승이나 어른의 도움을 받을 수 있고, 지혜와 지식을 쌓기에 적합합니다. 안정적이고 평온한 시기이나, 지나친 의존은 피하세요.';
        break;
      default:
        fortune =
          '올해는 전반적으로 균형잡힌 해입니다. 무리하지 않고 꾸준히 노력하면 좋은 결과를 얻을 수 있습니다.';
    }

    // 오행 관계 추가 해석
    if (relationship === 'conflicting') {
      fortune +=
        ' 다만 올해는 도전적인 요소가 있어 신중한 판단과 인내심이 필요합니다.';
    } else if (relationship === 'supportive') {
      fortune += ' 흐름이 순조로워 계획한 일들이 잘 풀릴 것입니다.';
    }

    return fortune;
  }

  // 십성(十星) 계산
  static getSipseong(dayMaster: string, targetStem: string): string {
    const dayElement = this.getElementFromStem(dayMaster);
    const targetElement = this.getElementFromStem(targetStem);
    const dayYinYang = ['갑', '병', '무', '경', '임'].includes(dayMaster)
      ? 'yang'
      : 'yin';
    const targetYinYang = ['갑', '병', '무', '경', '임'].includes(targetStem)
      ? 'yang'
      : 'yin';

    // 같은 오행
    if (dayElement === targetElement) {
      return '비겁'; // 비견, 겁재
    }

    // 일간이 생하는 오행
    const supportive = {
      목: '화',
      화: '토',
      토: '금',
      금: '수',
      수: '목',
    };
    if (supportive[dayElement] === targetElement) {
      return '식상'; // 식신, 상관
    }

    // 일간이 극하는 오행
    const controlling = {
      목: '토',
      화: '금',
      토: '수',
      금: '목',
      수: '화',
    };
    if (controlling[dayElement] === targetElement) {
      return '재성'; // 편재, 정재
    }

    // 일간을 극하는 오행
    const controlled = {
      목: '금',
      화: '수',
      토: '목',
      금: '화',
      수: '토',
    };
    if (controlled[dayElement] === targetElement) {
      return '관성'; // 편관, 정관
    }

    // 일간을 생하는 오행
    const supported = {
      목: '수',
      화: '목',
      토: '화',
      금: '토',
      수: '금',
    };
    if (supported[dayElement] === targetElement) {
      return '인성'; // 편인, 정인
    }

    return '비겁';
  }

  // 연애운 (도화살, 합 등 고려)
  static getLoveFortune(dayMaster: string, yearBranch: string): string {
    const loveStars = ['자', '오', '묘', '유']; // 도화살
    const dayBranch = this.getDayBranchFromStem(dayMaster); // 일간에서 추정

    let fortune = '💕 연애운: ';

    // 도화살 확인
    if (loveStars.includes(yearBranch)) {
      fortune +=
        '매력이 높아지는 시기입니다. 새로운 만남의 기회가 많고, 이성에게 좋은 인상을 줄 수 있습니다. 사교 활동이 활발해지며 인기가 상승합니다. ';
    }

    // 지지 육합 확인
    const yukHap = {
      자: '축',
      축: '자',
      인: '해',
      해: '인',
      묘: '술',
      술: '묘',
      진: '유',
      유: '진',
      사: '신',
      신: '사',
      오: '미',
      미: '오',
    };

    if (dayBranch && yukHap[dayBranch] === yearBranch) {
      fortune +=
        '육합의 기운으로 인연이 깊어지는 해입니다. 좋은 만남이 있거나 기존 관계가 발전할 수 있습니다. ';
    }

    // 기본 메시지
    if (fortune === '💕 연애운: ') {
      fortune +=
        '안정적인 관계 유지에 좋은 시기입니다. 진지한 대화와 이해를 통해 관계가 깊어집니다. 성급하게 서두르기보다는 꾸준히 마음을 나누세요.';
    }

    return fortune.trim();
  }

  // 일간에서 일지 추정 (간략 버전)
  static getDayBranchFromStem(_dayMaster: string): string | null {
    // 실제로는 사주 전체에서 일지를 가져와야 하지만, 여기서는 null 반환
    return null;
  }

  // 재물운 (십성 기반)
  static getWealthFortune(dayMaster: string, yearStem: string): string {
    const dayElement = this.getElementFromStem(dayMaster);
    const yearElement = this.getElementFromStem(yearStem);
    const sipseong = this.getSipseong(dayMaster, yearStem);

    let fortune = '💰 재물운: ';

    // 재성(剋하는 오행)인지 확인
    const controlling = {
      목: '토',
      화: '금',
      토: '수',
      금: '목',
      수: '화',
    };

    if (controlling[dayElement] === yearElement || sipseong === '재성') {
      fortune +=
        '재물을 얻을 기회가 많은 해입니다. 투자나 사업에서 성과를 거둘 수 있으며, 부동산이나 금융 상품에 관심을 가져보세요. 다만 과욕은 금물이며, 신중한 판단이 필요합니다.';
    } else if (sipseong === '비겁') {
      fortune +=
        '재물 관리에 주의가 필요한 해입니다. 불필요한 지출을 줄이고, 타인에게 돈을 빌려주는 것을 자제하세요. 형제나 동업자와의 금전 문제에 신중해야 합니다.';
    } else if (sipseong === '식상') {
      fortune +=
        '노력한 만큼 수입이 생기는 해입니다. 창의적인 아이디어나 재능을 활용하면 재물을 얻을 수 있습니다. 부업이나 새로운 수입원을 개척하기에 좋습니다.';
    } else if (sipseong === '관성') {
      fortune +=
        '직장에서의 승진이나 안정적인 급여가 기대되는 해입니다. 정직하고 성실한 태도로 일하면 정당한 보상을 받을 수 있습니다.';
    } else {
      fortune +=
        '안정적인 재정 관리가 필요한 해입니다. 꾸준한 저축과 계획적인 소비를 권장합니다. 큰 투자보다는 안전한 자산 관리에 집중하세요.';
    }

    return fortune;
  }

  // 건강운
  static getHealthFortune(_dayMaster: string, elements?: any): string {
    if (!elements) {
      return '🏥 건강운: 규칙적인 생활과 적절한 휴식이 필요합니다.';
    }

    const minElement = Object.entries(elements).reduce(
      (min, [elem, count]) =>
        (count as number) < min.count
          ? { element: elem, count: count as number }
          : min,
      { element: '', count: 10 },
    );

    const healthAdvice: { [key: string]: string } = {
      목: '간과 눈 건강에 유의하세요. 스트레스 관리가 중요합니다.',
      화: '심장과 혈액순환에 신경 쓰세요. 과로를 피하고 충분한 휴식을 취하세요.',
      토: '소화기 건강을 챙기세요. 규칙적인 식사와 적절한 운동이 필요합니다.',
      금: '호흡기 건강에 주의하세요. 환기를 자주 하고 미세먼지를 조심하세요.',
      수: '신장과 방광 건강에 유의하세요. 충분한 수분 섭취가 중요합니다.',
    };

    return `🏥 건강운: ${healthAdvice[minElement.element] || '전반적인 건강 관리가 필요합니다.'}`;
  }

  // AI 기반 개인 맞춤형 조언 생성
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

    // AI 조언 생성 (전체 사주 정보 활용)
    if (fourPillars && currentYear && gender && elements && yinYang) {
      try {
        const apiKey = process.env.GEMINI_API_KEY || '';

        const prompt = `당신은 한국의 전문 사주 명리학자입니다. 다음 사주 정보를 바탕으로 ${currentYear}년 올해의 구체적인 행동 가이드를 JSON 형식으로 작성해주세요.

**사주 정보:**
- 성별: ${gender}
- 일간(日干): ${dayMaster} (${dayElement})
- 년주(年柱): ${fourPillars.year.heaven}${fourPillars.year.earth}
- 월주(月柱): ${fourPillars.month.heaven}${fourPillars.month.earth}
- 일주(日柱): ${fourPillars.day.heaven}${fourPillars.day.earth}
- 시주(時柱): ${fourPillars.time ? fourPillars.time.heaven + fourPillars.time.earth : '미상'}
- 오행 분포: 목=${elements.목}, 화=${elements.화}, 토=${elements.토}, 금=${elements.금}, 수=${elements.수}
- 음양 분포: 음=${yinYang.yin}, 양=${yinYang.yang}
- ${currentYear}년 천간: ${yearStem} (${yearElement})
- ${currentYear}년 지지: ${yearBranch}
- 오행 관계: ${relationship === 'supportive' ? '상생' : relationship === 'conflicting' ? '상극' : '중립'}

**중요: 반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요:**

{
  "keywords": [
    "키워드1",
    "키워드2",
    "키워드3",
    "키워드4",
    "키워드5"
  ],
  "shouldDo": [
    "해야 할 일 1",
    "해야 할 일 2",
    "해야 할 일 3"
  ],
  "shouldAvoid": [
    "피해야 할 일 1",
    "피해야 할 일 2",
    "피해야 할 일 3"
  ]
}

**주의사항:**
- keywords는 정확히 5개만 작성하세요.
- shouldDo는 정확히 3개만 작성하세요.
- shouldAvoid는 정확히 3개만 작성하세요.
- 각 항목은 구체적이고 실천 가능한 내용으로 작성하세요.`;

        // Gemini REST API 직접 호출
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Gemini API 오류 응답:', errorText);
          throw new Error(
            `Gemini API Error: ${response.status} ${response.statusText} - ${errorText}`,
          );
        }

        const data = await response.json();
        console.log('Gemini API 응답:', JSON.stringify(data, null, 2));
        const text =
          data.candidates?.[0]?.content?.parts?.[0]?.text ||
          JSON.stringify(data);

        // JSON 추출 (마크다운 코드블록 제거 및 텍스트 내 JSON 탐지)
        let jsonText = text.trim();

        // 1. 마크다운 코드블록 제거 시도
        if (jsonText.includes('```json')) {
          const match = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
          if (match) jsonText = match[1].trim();
        } else if (jsonText.includes('```')) {
          const match = jsonText.match(/```\s*([\s\S]*?)\s*```/);
          if (match) jsonText = match[1].trim();
        }

        // 2. 텍스트 내에서 JSON 객체 찾기
        if (!jsonText.startsWith('{')) {
          const jsonMatch = jsonText.match(
            /\{[\s\S]*"keywords"[\s\S]*"shouldDo"[\s\S]*"shouldAvoid"[\s\S]*\}/,
          );
          if (jsonMatch) {
            jsonText = jsonMatch[0];
          }
        }

        const aiResult = JSON.parse(jsonText);

        // 포맷팅 (각각 정확히 3개씩만)
        let advice = '🔑 핵심 키워드:\n';
        advice += (aiResult.keywords || [])
          .slice(0, 5)
          .map((item: string) => `#${item}`)
          .join(' ');
        advice += '\n\n✅ 해야 할 일:\n';
        advice += (aiResult.shouldDo || [])
          .slice(0, 3)
          .map((item: string, i: number) => `${i + 1}. ${item}`)
          .join('\n');
        advice += '\n\n⚠️ 피해야 할 일:\n';
        advice += (aiResult.shouldAvoid || [])
          .slice(0, 3)
          .map((item: string, i: number) => `${i + 1}. ${item}`)
          .join('\n');

        return advice;
      } catch (error) {
        console.error('AI 조언 생성 실패, 기본 조언으로 폴백:', error);
      }
    }

    // AI 실패 시 폴백 메시지
    return '맞춤형 행동 가이드를 생성할 수 없습니다. 나중에 다시 시도해주세요.';
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
