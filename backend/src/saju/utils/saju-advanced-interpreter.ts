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

  // 연간 전체 운세
  static getYearlyOverallFortune(dayMaster: string, yearStem: string): string {
    const dayElement = this.getElementFromStem(dayMaster);
    const yearElement = this.getElementFromStem(yearStem);
    const relationship = this.getFiveElementsRelationship(dayElement, yearElement);

    if (relationship === 'supportive') {
      return '올해는 유리한 기운이 흐르는 해입니다. 하던 일이 순조롭게 풀리고 새로운 기회가 찾아올 수 있습니다.';
    } else if (relationship === 'conflicting') {
      return '올해는 도전적인 해입니다. 어려움이 있을 수 있지만 이를 극복하면 큰 성장의 기회가 됩니다.';
    } else {
      return '올해는 전반적으로 평온한 해입니다. 안정적으로 계획을 실행하기 좋은 시기입니다.';
    }
  }

  // 연애운
  static getLoveFortune(_dayMaster: string, yearBranch: string): string {
    const loveStars = ['자', '오', '묘', '유']; // 도화살
    if (loveStars.includes(yearBranch)) {
      return '💕 연애운: 매력이 높아지는 시기입니다. 새로운 만남의 기회가 많고, 이성에게 좋은 인상을 줄 수 있습니다.';
    }
    return '💕 연애운: 안정적인 관계 유지에 좋은 시기입니다. 진지한 대화와 이해를 통해 관계가 깊어집니다.';
  }

  // 재물운
  static getWealthFortune(dayMaster: string, yearStem: string): string {
    const dayElement = this.getElementFromStem(dayMaster);
    const yearElement = this.getElementFromStem(yearStem);

    // 재성(剋하는 오행)인지 확인
    const controlling = {
      목: '토',
      화: '금',
      토: '수',
      금: '목',
      수: '화',
    };

    if (controlling[dayElement] === yearElement) {
      return '💰 재물운: 재물을 얻을 기회가 많은 해입니다. 투자나 사업 확장을 고려해볼 만합니다.';
    }
    return '💰 재물운: 안정적인 재정 관리가 필요한 해입니다. 꾸준한 저축과 계획적인 소비를 권장합니다.';
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

**요청사항:**
1. 위 사주 정보를 종합적으로 분석하여 ${currentYear}년 운세 총정리를 작성하세요.
2. 일간의 특성, 오행 균형, 음양 균형, 올해 년운과의 관계를 모두 고려하세요.
3. 반드시 아래 JSON 형식으로만 응답하세요:

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
}`;

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
          const jsonMatch = jsonText.match(/\{[\s\S]*"keywords"[\s\S]*"shouldDo"[\s\S]*"shouldAvoid"[\s\S]*\}/);
          if (jsonMatch) {
            jsonText = jsonMatch[0];
          }
        }

        const aiResult = JSON.parse(jsonText);

        // 포맷팅
        let advice = '**🔑 핵심 키워드:**\n';
        advice += (aiResult.keywords || [])
          .map((item: string) => `#${item}`)
          .join(' ');
        advice += '\n\n**✅ 해야 할 일:**\n';
        advice += (aiResult.shouldDo || [])
          .map((item: string, i: number) => `${i + 1}. ${item}`)
          .join('\n');
        advice += '\n\n**⚠️ 피해야 할 일:**\n';
        advice += (aiResult.shouldAvoid || [])
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
