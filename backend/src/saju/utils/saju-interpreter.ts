import { ELEMENT_EMOJI, ELEMENT_HANJA, FIVE_ELEMENTS } from './constants';

interface PersonalityInfo {
  basic: string;
  strength: string;
  weakness: string;
  element: string;
  yinyang: string;
}

interface ElementBalance {
  element: string;
  percentage: number;
  count: number;
}

export class SajuInterpreter {
  static readonly PERSONALITY_BY_DAY_STEM: Record<string, PersonalityInfo> = {
    갑: {
      basic:
        '갑목(甲木)은 큰 나무를 상징합니다. 정직하고 곧으며, 인의예지신을 중시합니다. 대의명분을 중요시하고 리더십이 강합니다. 양목(陽木)으로서 적극적이고 진취적인 기상을 가지고 있습니다.',
      strength: '정직성, 리더십, 대의명분, 포부, 인덕',
      weakness: '융통성 부족, 고집, 체면 중시, 권위적',
      element: '목(木)',
      yinyang: '양(陽)',
    },
    을: {
      basic:
        '을목(乙木)은 꽃과 풀을 상징합니다. 부드럽고 유연하며, 온화한 성품을 지녔습니다. 음목(陰木)으로서 적응력이 뛰어나고 섬세한 감성을 가지고 있습니다. 예술적 감각이 뛰어납니다.',
      strength: '유연성, 적응력, 온화함, 예술성, 섬세함',
      weakness: '우유부단, 의존성, 나약함, 변덕',
      element: '목(木)',
      yinyang: '음(陰)',
    },
    병: {
      basic:
        '병화(丙火)는 태양을 상징합니다. 밝고 활발하며 열정적입니다. 양화(陽火)로서 모든 것을 밝히고 드러내는 성향이 있으며, 베푸는 것을 좋아합니다. 낙천적이고 대범합니다.',
      strength: '열정, 관대함, 낙천성, 활력, 명랑함',
      weakness: '성급함, 과시욕, 낭비벽, 인내심 부족',
      element: '화(Fire)',
      yinyang: '양(陽)',
    },
    정: {
      basic:
        '정화(丁火)는 촛불이나 등불을 상징합니다. 음화(陰火)로서 따뜻하고 온화하며, 세심한 배려를 합니다. 예민하고 감수성이 풍부하며, 문학적 재능이 있습니다.',
      strength: '온화함, 세심함, 예술성, 직관력, 배려심',
      weakness: '예민함, 의심, 변덕, 소심함',
      element: '화(火)',
      yinyang: '음(陰)',
    },
    무: {
      basic:
        '무토(戊土)는 산이나 큰 땅을 상징합니다. 양토(陽土)로서 중후하고 믿음직스러우며, 포용력이 있습니다. 중용을 중시하고 신용을 생명처럼 여깁니다.',
      strength: '신뢰성, 포용력, 중후함, 인내심, 책임감',
      weakness: '완고함, 둔중함, 보수성, 변화 거부',
      element: '토(土)',
      yinyang: '양(陽)',
    },
    기: {
      basic:
        '기토(己土)는 밭이나 정원의 흙을 상징합니다. 음토(陰土)로서 부드럽고 섬세하며, 실용적입니다. 계획적이고 꼼꼼하며, 절약정신이 강합니다.',
      strength: '실용성, 계획성, 섬세함, 절약정신, 성실함',
      weakness: '소심함, 인색함, 걱정 많음, 의심',
      element: '토(土)',
      yinyang: '음(陰)',
    },
    경: {
      basic:
        '경금(庚金)은 쇠나 칼을 상징합니다. 양금(陽金)으로서 강직하고 과단성이 있으며, 의리를 중시합니다. 결단력이 뛰어나고 추진력이 강합니다.',
      strength: '결단력, 의리, 용맹함, 추진력, 정의감',
      weakness: '강직함, 고집, 냉정함, 융통성 부족',
      element: '금(金)',
      yinyang: '양(陽)',
    },
    신: {
      basic:
        '신금(辛金)은 보석이나 장신구를 상징합니다. 음금(陰金)으로서 예리하고 섬세하며, 깔끔합니다. 명예욕이 강하고 체면을 중시합니다.',
      strength: '예리함, 깔끔함, 명예욕, 섬세함, 분별력',
      weakness: '예민함, 까다로움, 비판적, 허영심',
      element: '금(金)',
      yinyang: '음(陰)',
    },
    임: {
      basic:
        '임수(壬水)는 바다나 큰 강을 상징합니다. 양수(陽水)로서 지혜롭고 포용력이 있으며, 변화를 추구합니다. 자유분방하고 활동적입니다.',
      strength: '지혜, 포용력, 적응력, 활동성, 자유로움',
      weakness: '방랑벽, 변덕, 안정감 부족, 방종',
      element: '수(水)',
      yinyang: '양(陽)',
    },
    계: {
      basic:
        '계수(癸水)는 이슬이나 빗물을 상징합니다. 음수(陰水)로서 섬세하고 부드러우며, 순수합니다. 상상력이 풍부하고 감수성이 예민합니다.',
      strength: '상상력, 순수함, 감수성, 부드러움, 직관력',
      weakness: '나약함, 의존성, 비현실적, 감정적',
      element: '수(水)',
      yinyang: '음(陰)',
    },
  };

  static interpretFiveElements(elements: Record<string, number>): string {
    const total = Object.values(elements).reduce(
      (sum, count) => sum + count,
      0,
    );
    const balance = this.calculateElementBalance(elements, total);

    let interpretation = '오행 분석:\n';

    const dominantElements = balance.filter((item) => item.percentage > 40);
    const lackingElements = balance.filter((item) => item.percentage < 10);

    if (dominantElements.length > 0) {
      dominantElements.forEach((item) => {
        interpretation += this.interpretDominantElement(item);
      });
    }

    if (lackingElements.length > 0) {
      lackingElements.forEach((item) => {
        interpretation += this.interpretLackingElement(item);
      });
    }

    const isBalanced = balance.every(
      (item) => item.percentage >= 15 && item.percentage <= 25,
    );
    if (isBalanced) {
      interpretation +=
        '\n오행의 균형이 이상적인 사주\n\n특징: 조화로운 성격, 뛰어난 적응력, 종합적 사고력.\n장점: 건강한 체질, 다양한 분야 능력 발휘, 원만한 인간관계.\n\n';
    }

    return interpretation;
  }

  private static calculateElementBalance(
    elements: Record<string, number>,
    total: number,
  ): ElementBalance[] {
    return Object.entries(elements).map(([element, count]) => ({
      element,
      percentage: (count / total) * 100,
      count,
    }));
  }

  private static interpretDominantElement(item: ElementBalance): string {
    const emoji = ELEMENT_EMOJI[item.element];
    const hanja = ELEMENT_HANJA[item.element];

    let result = `${emoji} ${item.element}(${hanja}) 기운이 강한 체질\n\n`;

    const descriptions: Record<string, string> = {
      목: '성격: 따뜻하고 성장 지향적이며, 발전과 배움을 추구함.\n능력 분야: 교육, 문화예술, 창작 활동 등에 적합.\n건강: 간담, 신경계 주의. 스트레스 조절과 숙면 필요.\n주의: 목이 지나치면 질투·우유부단·신경질적 성향이 생길 수 있음. 화(火)로 균형 보완.\n',
      화: '성격: 밝고 활발하며 열정적임. 표현력이 뛰어나고 사교적.\n능력 분야: 방송, 연예, 광고, 미용 등에 적합.\n건강: 심장, 혈관, 소장 주의. 충분한 휴식과 스트레스 관리 필요.\n주의: 화가 지나치면 성급함, 변덕이 생길 수 있음. 토(土)로 균형 보완.\n',
      토: '성격: 성실하고 포용력이 있음. 중재와 조정 능력이 뛰어남.\n능력 분야: 부동산, 건설, 금융, 중개업 등에 적합.\n건강: 소화기계통(위, 비장, 췌장) 주의. 규칙적 식사와 운동 필요.\n주의: 토가 지나치면 고집과 변화 거부감이 생김. 금(金)으로 균형 보완.\n',
      금: '성격: 의리와 명예를 중시하며 결단력이 있음. 체계적이고 논리적.\n능력 분야: 금융, 법률, 의료, 기계공학 등에 적합.\n건강: 폐, 기관지, 대장, 피부 주의. 공기 좋은 환경에서 운동 필요.\n주의: 금이 지나치면 엄격하고 냉정해짐. 수(Water)로 균형 보완.\n',
      수: '성격: 지혜롭고 유연하며 적응력이 뛰어남. 직관력과 철학적 사고 발달.\n능력 분야: 학술, 연구, 의료, 무역업 등에 적합.\n건강: 신장, 방광, 생식기 주의. 충분한 수분 섭취와 하체 운동 필요.\n주의: 수가 지나치면 음울하고 의심 많아짐. 목(木)으로 균형 보완.\n',
    };

    result += descriptions[item.element] || '';
    return result;
  }

  private static interpretLackingElement(item: ElementBalance): string {
    const emoji = ELEMENT_EMOJI[item.element];
    const hanja = ELEMENT_HANJA[item.element];

    let result = `\n${emoji} ${item.element}(${hanja}) 기운이 약한 체질\n\n`;

    const descriptions: Record<string, string> = {
      목: '부족한 면: 성장력·창의력·유연성 부족.\n보완법: 독서·학습, 자연과 가까이하기, 새로운 취미 시도.\n개운법: 녹색 계열, 동쪽 배치, 나무 소재 활용.\n음식: 신맛 음식, 녹색 채소, 견과류.\n',
      화: '부족한 면: 활력·열정·적극성·리더십 부족.\n보완법: 운동·취미활동, 사교 모임 적극 참여.\n개운법: 붉은색 계열, 남쪽 배치, 따뜻한 조명.\n음식: 쓴맛 음식, 붉은 색 음식, 따뜻한 성질 음식.\n',
      토: '부족한 면: 안정감·끈기·인내력·신용 부족.\n보완법: 규칙적인 생활, 꾸준한 운동, 신뢰 관계 형성.\n개운법: 황색·갈색 계열, 중앙 배치, 도자기·흙 소재.\n음식: 단맛 음식, 곡물류, 뿌리채소류.\n',
      금: '부족한 면: 결단력·추진력·의리·원칙의식 부족.\n보완법: 명상·기도, 규칙적인 생활, 체계적 관리.\n개운법: 흰색·은색 계열, 서쪽 배치, 금속 소재.\n음식: 매운맛 음식, 흰 색 음식, 견과류.\n',
      수: '부족한 면: 지혜·통찰력·융통성·적응력 부족.\n보완법: 독서·명상, 충분한 수분섭취, 휴식.\n개운법: 검은색·파란색 계열, 북쪽 배치, 물 관련 인테리어.\n음식: 짠맛 음식, 검은 색 음식, 생선류.\n',
    };

    result += descriptions[item.element] || '';
    return result;
  }

  static interpretCareer(
    dayHeavenly: string,
    elements: Record<string, number>,
  ): string {
    const careerMap: Record<string, string[]> = {
      갑: [
        '대기업 임원',
        'CEO',
        '정치인',
        '판사',
        '교수',
        '산림청',
        '목재업',
        '가구업',
      ],
      을: [
        '예술가',
        '플로리스트',
        '디자이너',
        '한의사',
        '약사',
        '원예',
        '섬유업',
        '패션업',
      ],
      병: [
        '방송인',
        '연예인',
        '홍보',
        '마케팅',
        '관광업',
        '스포츠',
        '에너지산업',
        '조명업',
      ],
      정: [
        '작가',
        '시인',
        '요리사',
        '미용사',
        '조향사',
        '카운셀러',
        '종교인',
        '문화예술',
      ],
      무: [
        '부동산',
        '건설업',
        '농업',
        '공무원',
        '신탁업',
        '중개업',
        '토목',
        '도자기',
      ],
      기: [
        '회계사',
        '세무사',
        '농업',
        '원예',
        '인테리어',
        '도예가',
        '지질학자',
        '고고학자',
      ],
      경: [
        '군인',
        '경찰',
        '검사',
        '외과의사',
        '금속공업',
        '기계공업',
        '무술가',
        '운동선수',
      ],
      신: [
        '금은세공',
        '치과의사',
        '보석상',
        '금융업',
        '펀드매니저',
        '감정평가사',
        '비평가',
        '언론인',
      ],
      임: [
        '무역업',
        '해운업',
        '여행업',
        '철학자',
        '종교인',
        '외교관',
        '통역사',
        '수산업',
      ],
      계: [
        '학자',
        '연구원',
        '점술가',
        '심리학자',
        '작가',
        '비서',
        '서비스업',
        '의료업',
      ],
    };

    const careers = careerMap[dayHeavenly] || [];
    const dayInfo = this.PERSONALITY_BY_DAY_STEM[dayHeavenly];

    const dominantElement = Object.entries(elements).reduce(
      (max, [elem, count]) => (count > elements[max] ? elem : max),
      '목',
    );

    const elementCareerMap: Record<string, string> = {
      목: '교육, 출판, 의료, 예술 분야',
      화: '전자, IT, 미디어, 엔터테인먼트 분야',
      토: '부동산, 건설, 농업, 중개업 분야',
      금: '금융, 법률, 기계, 의료 분야',
      수: '무역, 유통, 서비스, 컨설팅 분야',
    };

    return (
      `◆ 일간 ${dayHeavenly}(${dayInfo.element})의 적성: ${careers.slice(0, 5).join(', ')}\n` +
      `◆ 오행 ${dominantElement}이 강한 적성: ${elementCareerMap[dominantElement]}\n` +
      `일간의 특성과 오행 균형을 고려할 때, 위 분야에서 탁월한 능력을 발휘할 수 있습니다.`
    );
  }

  static interpretRelationship(gender: string, dayHeavenly: string): string {
    const isYang = ['갑', '병', '무', '경', '임'].includes(dayHeavenly);

    const relationshipMap: Record<string, { male: string; female: string }> = {
      갑: {
        male: '정직하고 듬직한 남성으로, 한 번 마음을 주면 변하지 않습니다. 책임감이 강해 가정을 잘 이끕니다.',
        female:
          '주체적이고 당당한 여성으로, 자신의 의견을 분명히 표현합니다. 능력 있는 파트너를 선호합니다.',
      },
      을: {
        male: '온화하고 섬세한 남성으로, 상대방의 감정을 잘 헤아립니다. 예술적 감성으로 로맨틱합니다.',
        female:
          '부드럽고 여성스러운 매력이 있으며, 조화로운 관계를 추구합니다. 배려심이 깊습니다.',
      },
      병: {
        male: '밝고 활기찬 남성으로, 연애를 즐겁게 만듭니다. 관대하고 포용력이 있습니다.',
        female:
          '긍정적이고 매력적인 여성으로, 상대방을 밝게 만듭니다. 자유로운 관계를 선호합니다.',
      },
      정: {
        male: '로맨틱하고 감성적인 남성으로, 분위기를 중시합니다. 은은한 매력이 있습니다.',
        female:
          '신비롭고 매혹적인 여성으로, 상대방을 끌어당기는 매력이 있습니다. 감정이 깊습니다.',
      },
      무: {
        male: '믿음직스럽고 안정적인 남성으로, 가정적입니다. 변하지 않는 사랑을 추구합니다.',
        female:
          '포용력 있고 모성애가 강한 여성으로, 상대방을 편안하게 만듭니다. 안정된 관계를 원합니다.',
      },
      기: {
        male: '성실하고 꼼꼼한 남성으로, 세심한 배려를 합니다. 현실적인 사랑을 추구합니다.',
        female:
          '실속 있고 알뜰한 여성으로, 가정을 잘 꾸립니다. 안정적인 파트너를 선호합니다.',
      },
      경: {
        male: '남자다운 매력이 강하고, 결단력이 있습니다. 의리를 중시하며 보호본능이 강합니다.',
        female:
          '독립적이고 당찬 여성으로, 자신의 길을 개척합니다. 존경할 수 있는 파트너를 원합니다.',
      },
      신: {
        male: '세련되고 깔끔한 남성으로, 센스가 있습니다. 품위 있는 연애를 추구합니다.',
        female:
          '우아하고 품격 있는 여성으로, 고급스러운 취향을 가집니다. 능력 있는 파트너를 선호합니다.',
      },
      임: {
        male: '자유롭고 낭만적인 남성으로, 모험을 즐깁니다. 구속받지 않는 관계를 선호합니다.',
        female:
          '지적이고 매력적인 여성으로, 대화가 통하는 파트너를 원합니다. 정신적 교감을 중시합니다.',
      },
      계: {
        male: '감성적이고 이해심 많은 남성으로, 상대방을 잘 보듬습니다. 순수한 사랑을 추구합니다.',
        female:
          '순수하고 헌신적인 여성으로, 사랑에 올인합니다. 감정적 교류를 중시합니다.',
      },
    };

    let interpretation = '';
    const relationship = relationshipMap[dayHeavenly];
    if (relationship) {
      interpretation +=
        gender === '남' ? relationship.male : relationship.female;
      interpretation += '\n\n';
    }

    if (isYang) {
      interpretation += '◆ 양(陽)의 기운: 적극적이고 주도적인 연애를 합니다. ';
      interpretation +=
        gender === '남'
          ? '전통적인 남성상에 가까우며, 가정을 이끄는 가장 역할에 적합합니다.'
          : '주체적이고 독립적인 여성으로, 대등한 파트너십을 추구합니다.';
    } else {
      interpretation += '◆ 음(陰)의 기운: 수용적이고 배려 깊은 연애를 합니다. ';
      interpretation +=
        gender === '남'
          ? '현대적이고 감성적인 남성으로, 상대방과 공감하며 소통합니다.'
          : '전통적인 여성상에 가까우며, 조화롭고 평화로운 관계를 만듭니다.';
    }

    return interpretation;
  }

  static interpretWealth(dayHeavenly: string, yearEarthly: string): string {
    const wealthLuck: Record<string, string> = {
      갑: '정재(正財)를 추구하여 정당한 노력으로 부를 축적합니다. 부동산이나 장기 투자에 유리하며, 대기업이나 공직에서 안정적 수입을 얻습니다.',
      을: '편재(偏財)운이 있어 다양한 수입원을 만들 수 있습니다. 예술, 문화 사업이나 유연한 사고로 기회를 포착합니다.',
      병: '식신(食神)이 생재(生財)하여 즐기면서 돈을 법니다. 서비스업, 요식업, 엔터테인먼트 분야에서 재물운이 좋습니다.',
      정: '상관(傷官)이 생재하여 재능과 기술로 부를 창출합니다. 전문직이나 프리랜서로 성공할 가능성이 높습니다.',
      무: '비견(比肩)과 겁재(劫財)를 제압하여 경쟁에서 승리합니다. 부동산이나 중개업으로 큰 부를 축적할 수 있습니다.',
      기: '정인(正印)과 편인(偏印)으로 지식을 재물로 전환합니다. 교육, 컨설팅, 전문 서비스업에서 성공합니다.',
      경: '정관(正官)과 편관(偏官)으로 권력을 재물로 연결합니다. 사업가나 고위직으로 큰 부를 이룹니다.',
      신: '식상(食傷)이 왕하여 투자 감각이 뛰어납니다. 금융, 주식, 귀금속 관련 분야에서 재물운이 좋습니다.',
      임: '정재와 편재가 유통되어 물처럼 돈이 흐릅니다. 무역, 유통, 서비스업에서 큰 성공을 거둘 수 있습니다.',
      계: '인성(印星)이 강하여 명예가 재물로 이어집니다. 학문, 종교, 예술 분야에서 명성과 함께 부를 얻습니다.',
    };

    const earthlyWealth: Record<string, string> = {
      자: '역마살이 있어 움직이면서 돈을 법니다.',
      축: '고지(庫地)로 저축과 절약으로 부를 축적합니다.',
      인: '편재살이 있어 투자와 사업으로 큰 돈을 벌 수 있습니다.',
      묘: '도화살이 있어 인기와 매력으로 돈을 법니다.',
      진: '화개살이 있어 종교나 예술로 돈을 법니다.',
      사: '역마살과 함께 해외에서 기회가 있습니다.',
      오: '양인살이 있어 과감한 도전으로 성공합니다.',
      미: '고지로 늦게 부자가 되는 대기만성형입니다.',
      신: '편재가 왕하여 금융과 투자에 능합니다.',
      유: '도화와 함께 예술과 미용 분야에서 성공합니다.',
      술: '고지로 부동산과 저축으로 부를 축적합니다.',
      해: '역마와 천을귀인으로 무역과 해외사업에서 성공합니다.',
    };

    return (
      `◆ 일간 ${dayHeavenly}의 재물운:\n${wealthLuck[dayHeavenly] || '정당한 노력으로 안정적인 부를 축적할 수 있습니다.'}\n\n` +
      `◆ 년지 ${yearEarthly}의 특성:\n${earthlyWealth[yearEarthly] || '꾸준한 노력으로 재물을 모을 수 있습니다.'}`
    );
  }

  static interpretHealth(elements: Record<string, number>): string {
    const total = Object.values(elements).reduce(
      (sum, count) => sum + count,
      0,
    );
    let interpretation = '';

    Object.entries(elements).forEach(([element, count]) => {
      const percentage = (count / total) * 100;

      if (percentage > 40) {
        interpretation += this.getHealthWarning(element);
      }
    });

    Object.entries(elements).forEach(([element, count]) => {
      const percentage = (count / total) * 100;
      if (percentage < 15) {
        interpretation += this.getHealthSupplement(element);
      }
    });

    if (interpretation === '') {
      interpretation =
        '오행이 균형을 이루어 전반적으로 건강한 체질입니다.\n규칙적인 생활습관을 유지하며 예방에 힘쓰세요.';
    }

    return interpretation;
  }

  private static getHealthWarning(element: string): string {
    const warnings: Record<string, string> = {
      목: '◆ 목(Wood) 과다: 간장, 담낭 계통 주의\n- 주요 증상: 눈의 피로, 근육 경련, 신경과민, 두통\n- 관리법: 스트레스 관리, 규칙적인 운동, 신맛 음식 적당히 섭취\n- 주의사항: 과로와 분노 조절, 음주 절제',
      화: '◆ 화(Fire) 과다: 심장, 소장 계통 주의\n- 주요 증상: 불면증, 가슴 두근거림, 혈압 상승, 구내염\n- 관리법: 명상과 휴식, 쓴맛 음식 적당히 섭취\n- 주의사항: 과도한 흥분 자제, 규칙적인 수면',
      토: '◆ 토(Earth) 과다: 비장, 위장 계통 주의\n- 주요 증상: 소화불량, 위염, 당뇨 위험, 비만\n- 관리법: 규칙적인 식사, 단맛 음식 절제\n- 주의사항: 과식 금지, 걱정과 스트레스 관리',
      금: '◆ 금(Metal) 과다: 폐, 대장 계통 주의\n- 주요 증상: 호흡기 질환, 피부 트러블, 변비, 알레르기\n- 관리법: 맑은 공기 호흡, 매운맛 음식 절제\n- 주의사항: 금연 필수, 건조한 환경 피하기',
      수: '◆ 수(Water) 과다: 신장, 방광 계통 주의\n- 주요 증상: 부종, 요통, 이명, 탈모, 골다공증\n- 관리법: 체온 유지, 짠맛 음식 절제\n- 주의사항: 과도한 수분 섭취 주의, 하체 운동 강화',
    };
    return warnings[element] || '';
  }

  private static getHealthSupplement(element: string): string {
    const supplements: Record<string, string> = {
      목: '\n\n◆ 목(Wood) 부족: 간 기능 저하 주의\n- 보충법: 녹색 채소, 신맛 과일 섭취, 스트레칭',
      화: '\n\n◆ 화(Fire) 부족: 혈액순환 저하 주의\n- 보충법: 유산소 운동, 따뜻한 음식, 충분한 일광욕',
      토: '\n\n◆ 토(Earth) 부족: 소화력 저하 주의\n- 보충법: 규칙적 식사, 단호박, 고구마 등 섭취',
      금: '\n\n◆ 금(Metal) 부족: 면역력 저하 주의\n- 보충법: 심호흡 운동, 배, 무 등 흰색 음식 섭취',
      수: '\n\n◆ 수(Water) 부족: 신장 기능 저하 주의\n- 보충법: 충분한 수분 섭취, 검은콩, 검은깨 섭취',
    };
    return supplements[element] || '';
  }

  static interpretSocialRelationship(dayHeavenly: string): string {
    const isYang = ['갑', '병', '무', '경', '임'].includes(dayHeavenly);
    const dayElement = FIVE_ELEMENTS.getElementFromStem(dayHeavenly);

    const relationshipStyle: Record<string, string> = {
      갑: '신뢰와 의리를 중시하며, 자신과 가치관이 맞는 사람과 깊은 유대를 맺습니다. 리더십이 강해 주변 사람들을 이끄는 역할을 자주 맡습니다.',
      을: '온화하고 부드러운 성격으로 누구와도 잘 어울립니다. 섬세한 배려로 주변 사람들에게 편안함을 줍니다.',
      병: '밝고 활발한 에너지로 분위기 메이커 역할을 합니다. 넓은 인맥을 형성하며 사교적입니다.',
      정: '따뜻하고 세심한 성격으로 깊은 관계를 선호합니다. 소수의 친구와 진한 우정을 나눕니다.',
      무: '믿음직하고 포용력이 있어 주변 사람들의 중심이 됩니다. 안정적인 관계를 오래 유지합니다.',
      기: '성실하고 꼼꼼한 성격으로 신뢰를 얻습니다. 실속 있는 관계를 선호합니다.',
      경: '직설적이고 강직한 성격으로 의리를 중시합니다. 원칙적인 관계를 선호합니다.',
      신: '세련되고 품격 있는 교류를 좋아합니다. 수준 높은 인간관계를 형성합니다.',
      임: '자유롭고 활동적인 성격으로 다양한 사람들과 교류합니다. 폭넓은 인맥을 가집니다.',
      계: '감성적이고 이해심이 깊어 상대방의 마음을 잘 헤아립니다. 공감 능력이 뛰어납니다.',
    };

    let interpretation = `◆ 인간관계 스타일:\n${relationshipStyle[dayHeavenly]}\n\n`;

    interpretation += isYang
      ? '◆ 주의할 점:\n양기가 강하므로 자기주장이 센 편입니다. 융통성을 의식적으로 키우고, 상대방의 의견을 경청하는 자세가 필요합니다.\n\n'
      : '◆ 주의할 점:\n음기가 강하므로 수용적이지만 때론 우유부단할 수 있습니다. 자신의 의견을 명확히 표현하는 연습이 필요합니다.\n\n';

    const goodMatch: Record<string, string> = {
      목: '화(火) 기운이 강한 사람 또는 병(丙)·정(丁) 일간과 좋은 관계를 형성합니다.',
      화: '토(土) 기운이 강한 사람 또는 무(戊)·기(己) 일간과 좋은 관계를 형성합니다.',
      토: '금(金) 기운이 강한 사람 또는 경(庚)·신(辛) 일간과 좋은 관계를 형성합니다.',
      금: '수(水) 기운이 강한 사람 또는 임(壬)·계(癸) 일간과 좋은 관계를 형성합니다.',
      수: '목(木) 기운이 강한 사람 또는 갑(甲)·을(乙) 일간과 좋은 관계를 형성합니다.',
    };

    const avoidMatch: Record<string, string> = {
      목: '토(土) 기운이 지나치게 강한 사람과는 의견 충돌이 생기기 쉽습니다.',
      화: '수(水) 기운이 지나치게 강한 사람과는 갈등이 생길 수 있습니다.',
      토: '목(木) 기운이 지나치게 강한 사람과는 충돌할 가능성이 있습니다.',
      금: '화(火) 기운이 지나치게 강한 사람과는 마찰이 생길 수 있습니다.',
      수: '토(土) 기운이 지나치게 강한 사람과는 어려움이 있을 수 있습니다.',
    };

    interpretation += `◆ 좋은 인연:\n${goodMatch[dayElement]}\n\n`;
    interpretation += `◆ 주의 인연:\n${avoidMatch[dayElement]}`;

    return interpretation;
  }
}
