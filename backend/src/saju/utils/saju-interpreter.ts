export class SajuInterpreter {
  // 실제 사주명리학 기반 일간별 성격 특성
  static PERSONALITY_BY_DAY_STEM = {
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
      element: '화(火)',
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

  //  실제 사주명리학 기반 오행 균형에 따른 해석
  static interpretFiveElements(elements: { [key: string]: number }): string {
    const total = Object.values(elements).reduce(
      (sum, count) => sum + count,
      0,
    );
    const balance = Object.entries(elements).map(([element, count]) => ({
      element,
      percentage: (count / total) * 100,
    }));

    let interpretation = '오행 분석:\n';

    // 가장 많은 오행
    const dominant = balance.reduce((max, curr) =>
      curr.percentage > max.percentage ? curr : max,
    );

    // 가장 적은 오행
    const lacking = balance.reduce((min, curr) =>
      curr.percentage < min.percentage ? curr : min,
    );

    if (dominant.percentage > 40) {
      interpretation += `${dominant.element}(${
        dominant.element === '목'
          ? '木'
          : dominant.element === '화'
            ? '火'
            : dominant.element === '토'
              ? '土'
              : dominant.element === '금'
                ? '金'
                : '水'
      })의 기운이 강하여 `;

      switch (dominant.element) {
        case '목':
          interpretation +=
            '목기(木氣)가 왕성하여 인자하고 성장 지향적입니다. 학문과 예술에 재능이 있으며, 교육이나 문화 분야에서 두각을 나타냅니다. 단, 목이 과다하면 질투심이나 신경질적인 면이 나타날 수 있습니다.\n';
          break;
        case '화':
          interpretation +=
            '화기(火氣)가 왕성하여 예의 바르고 명랑합니다. 예술적 감각과 표현력이 뛰어나며, 대중과 소통하는 분야에서 능력을 발휘합니다. 단, 화가 과다하면 성급하고 변덕스러울 수 있습니다.\n';
          break;
        case '토':
          interpretation +=
            '토기(土氣)가 왕성하여 신용과 믿음을 중시합니다. 중재와 조정 능력이 뛰어나며, 부동산이나 중개업에 적합합니다. 단, 토가 과다하면 고집스럽고 변화를 거부할 수 있습니다.\n';
          break;
        case '금':
          interpretation +=
            '금기(金氣)가 왕성하여 의리와 명예를 중시합니다. 결단력과 추진력이 강하며, 군인이나 경찰 등 규율이 필요한 분야에 적합합니다. 단, 금이 과다하면 지나치게 엄격하고 냉정할 수 있습니다.\n';
          break;
        case '수':
          interpretation +=
            '수기(水氣)가 왕성하여 지혜롭고 총명합니다. 학문과 연구에 재능이 있으며, 철학이나 종교 분야에 관심이 많습니다. 단, 수가 과다하면 음울하고 비관적일 수 있습니다.\n';
          break;
      }
    }

    if (lacking.percentage < 10) {
      interpretation += `${lacking.element}의 기운이 부족하여 `;

      switch (lacking.element) {
        case '목':
          interpretation +=
            '목기(木氣)가 부족하여 인정이나 배려심이 부족할 수 있습니다. 성장욕구나 발전 의지를 강화할 필요가 있습니다. 녹색 계열을 활용하고 동쪽 방향이 유리합니다.\n';
          break;
        case '화':
          interpretation +=
            '화기(火氣)가 부족하여 활력이나 열정이 부족할 수 있습니다. 적극성과 표현력을 기를 필요가 있습니다. 붉은색 계열을 활용하고 남쪽 방향이 유리합니다.\n';
          break;
        case '토':
          interpretation +=
            '토기(土氣)가 부족하여 신용이나 안정감이 부족할 수 있습니다. 중심을 잡고 균형감을 기를 필요가 있습니다. 황색 계열을 활용하고 중앙이 유리합니다.\n';
          break;
        case '금':
          interpretation +=
            '금기(金氣)가 부족하여 결단력이나 의리가 부족할 수 있습니다. 원칙과 규율을 세울 필요가 있습니다. 흰색 계열을 활용하고 서쪽 방향이 유리합니다.\n';
          break;
        case '수':
          interpretation +=
            '수기(水氣)가 부족하여 지혜나 융통성이 부족할 수 있습니다. 학습과 사고력을 기를 필요가 있습니다. 검은색 계열을 활용하고 북쪽 방향이 유리합니다.\n';
          break;
      }
    }

    return interpretation;
  }

  // 실제 사주명리학 기반 직업 적성 해석
  static interpretCareer(
    dayHeavenly: string,
    elements: { [key: string]: number },
  ): string {
    const careerMap = {
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

    // 오행별 추가 직업 추천
    const dominantElement = Object.entries(elements).reduce(
      (max, [elem, count]) => (count > elements[max] ? elem : max),
      '목',
    );

    let elementCareer = '';
    switch (dominantElement) {
      case '목':
        elementCareer = '교육, 출판, 의료, 예술 분야';
        break;
      case '화':
        elementCareer = '전자, IT, 미디어, 엔터테인먼트 분야';
        break;
      case '토':
        elementCareer = '부동산, 건설, 농업, 중개업 분야';
        break;
      case '금':
        elementCareer = '금융, 법률, 기계, 의료 분야';
        break;
      case '수':
        elementCareer = '무역, 유통, 서비스, 컨설팅 분야';
        break;
    }

    return (
      `직업 적성:\n` +
      `◆ 일간 ${dayHeavenly}(${dayInfo?.element})의 적성: ${careers.slice(0, 5).join(', ')}\n` +
      `◆ 오행 ${dominantElement}이 강한 적성: ${elementCareer}\n` +
      `일간의 특성과 오행 균형을 고려할 때, 위 분야에서 탁월한 능력을 발휘할 수 있습니다.`
    );
  }

  // 실제 사주명리학 기반 관계 운 해석
  static interpretRelationship(gender: string, dayHeavenly: string): string {
    const isYang = ['갑', '병', '무', '경', '임'].includes(dayHeavenly);
    let interpretation = '연애/결혼운:\n';

    // 일간별 상세 연애운
    const relationshipMap: { [key: string]: { male: string; female: string } } =
      {
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

    const relationship = relationshipMap[dayHeavenly];
    if (relationship) {
      interpretation +=
        gender === '남' ? relationship.male : relationship.female;
      interpretation += '\n\n';
    }

    // 음양 조화 설명
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

  // 재물운 해석 (실제 사주명리학 기반)
  static interpretWealth(dayHeavenly: string, yearEarthly: string): string {
    const wealthLuck = {
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

    // 12지지별 추가 재물운
    const earthlyWealth: { [key: string]: string } = {
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
      `재물운:\n` +
      `◆ 일간 ${dayHeavenly}의 재물운:\n${wealthLuck[dayHeavenly] || '정당한 노력으로 안정적인 부를 축적할 수 있습니다.'}\n\n` +
      `◆ 년지 ${yearEarthly}의 특성:\n${earthlyWealth[yearEarthly] || '꾸준한 노력으로 재물을 모을 수 있습니다.'}`
    );
  }

  // 실제 사주명리학 기반 건강운 해석
  static interpretHealth(elements: { [key: string]: number }): string {
    const total = Object.values(elements).reduce(
      (sum, count) => sum + count,
      0,
    );
    let interpretation = '건강운:\n';

    // 오행 불균형에 따른 건강 주의사항
    Object.entries(elements).forEach(([element, count]) => {
      const percentage = (count / total) * 100;

      if (percentage > 40) {
        switch (element) {
          case '목':
            interpretation +=
              '◆ 목(木) 과다: 간장, 담낭 계통 주의\n' +
              '- 주요 증상: 눈의 피로, 근육 경련, 신경과민, 두통\n' +
              '- 관리법: 스트레스 관리, 규칙적인 운동, 신맛 음식 적당히 섭취\n' +
              '- 주의사항: 과로와 분노 조절, 음주 절제';
            break;
          case '화':
            interpretation +=
              '◆ 화(火) 과다: 심장, 소장 계통 주의\n' +
              '- 주요 증상: 불면증, 가슴 두근거림, 혈압 상승, 구내염\n' +
              '- 관리법: 명상과 휴식, 쓴맛 음식 적당히 섭취\n' +
              '- 주의사항: 과도한 흥분 자제, 규칙적인 수면';
            break;
          case '토':
            interpretation +=
              '◆ 토(土) 과다: 비장, 위장 계통 주의\n' +
              '- 주요 증상: 소화불량, 위염, 당뇨 위험, 비만\n' +
              '- 관리법: 규칙적인 식사, 단맛 음식 절제\n' +
              '- 주의사항: 과식 금지, 걱정과 스트레스 관리';
            break;
          case '금':
            interpretation +=
              '◆ 금(金) 과다: 폐, 대장 계통 주의\n' +
              '- 주요 증상: 호흡기 질환, 피부 트러블, 변비, 알레르기\n' +
              '- 관리법: 맑은 공기 호흡, 매운맛 음식 절제\n' +
              '- 주의사항: 금연 필수, 건조한 환경 피하기';
            break;
          case '수':
            interpretation +=
              '◆ 수(水) 과다: 신장, 방광 계통 주의\n' +
              '- 주요 증상: 부종, 요통, 이명, 탈모, 골다공증\n' +
              '- 관리법: 체온 유지, 짠맛 음식 절제\n' +
              '- 주의사항: 과도한 수분 섭취 주의, 하체 운동 강화';
            break;
        }
      }
    });

    // 부족한 오행에 대한 보충 건강법 추가
    Object.entries(elements).forEach(([element, count]) => {
      const percentage = (count / total) * 100;
      if (percentage < 15) {
        interpretation += '\n\n';
        switch (element) {
          case '목':
            interpretation +=
              '◆ 목(木) 부족: 간 기능 저하 주의\n- 보충법: 녹색 채소, 신맛 과일 섭취, 스트레칭';
            break;
          case '화':
            interpretation +=
              '◆ 화(火) 부족: 혈액순환 저하 주의\n- 보충법: 유산소 운동, 따뜻한 음식, 충분한 일광욕';
            break;
          case '토':
            interpretation +=
              '◆ 토(土) 부족: 소화력 저하 주의\n- 보충법: 규칙적 식사, 단호박, 고구마 등 섭취';
            break;
          case '금':
            interpretation +=
              '◆ 금(金) 부족: 면역력 저하 주의\n- 보충법: 심호흡 운동, 배, 무 등 흰색 음식 섭취';
            break;
          case '수':
            interpretation +=
              '◆ 수(水) 부족: 신장 기능 저하 주의\n- 보충법: 충분한 수분 섭취, 검은콩, 검은깨 섭취';
            break;
        }
      }
    });

    if (interpretation === '건강운:\n') {
      interpretation +=
        '오행이 균형을 이루어 전반적으로 건강한 체질입니다.\n규칙적인 생활습관을 유지하며 예방에 힘쓰세요.';
    }

    return interpretation;
  }

  // 올해 운세 (간단쓰)
  static interpretYearlyFortune(
    currentYear: number,
    birthYear: number,
  ): string {
    const age = currentYear - birthYear;
    const cycle = age % 12;

    const fortunes = [
      '새로운 시작과 도전의 해입니다. 적극적으로 기회를 잡으세요.',
      '안정과 성장의 해입니다. 꾸준한 노력이 결실을 맺습니다.',
      '변화와 전환의 해입니다. 유연하게 대처하면 좋은 결과가 있습니다.',
      '도약과 발전의 해입니다. 큰 성과를 기대할 수 있습니다.',
      '조정과 정리의 해입니다. 불필요한 것을 정리하고 새로운 준비를 하세요.',
      '협력과 인연의 해입니다. 좋은 사람들과의 만남이 기대됩니다.',
      '수확과 결실의 해입니다. 그동안의 노력이 보상받습니다.',
      '휴식과 충전의 해입니다. 건강관리에 신경쓰세요.',
      '도전과 모험의 해입니다. 새로운 분야에 도전해보세요.',
      '안정과 화합의 해입니다. 가족과 주변 사람들과의 관계가 중요합니다.',
      '성취와 인정의 해입니다. 능력을 인정받고 승진이나 성공이 기대됩니다.',
      '준비와 계획의 해입니다. 미래를 위한 준비를 철저히 하세요.',
    ];

    return `${currentYear}년 운세:\n${fortunes[cycle]}`;
  }
}
