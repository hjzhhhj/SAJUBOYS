export class SajuInterpreter {
  // 일간별 성격 특성
  static PERSONALITY_BY_DAY_STEM = {
    '갑': {
      basic: '리더십이 강하고 정직하며 곧은 성품을 가지고 있습니다. 새로운 시작을 좋아하고 개척정신이 강합니다.',
      strength: '추진력, 결단력, 정의감, 진취성',
      weakness: '고집, 융통성 부족, 독선적 경향'
    },
    '을': {
      basic: '부드럽고 유연하며 적응력이 뛰어납니다. 협조적이고 타인을 배려하는 성품입니다.',
      strength: '적응력, 유연성, 협조성, 인내심',
      weakness: '우유부단, 의존적, 소극적'
    },
    '병': {
      basic: '밝고 활발하며 열정적입니다. 타인에게 온화하고 포용력이 있습니다.',
      strength: '열정, 온화함, 사교성, 창의성',
      weakness: '감정 기복, 충동적, 인내심 부족'
    },
    '정': {
      basic: '섬세하고 예민하며 감수성이 풍부합니다. 예술적 재능과 직관력이 뛰어납니다.',
      strength: '직관력, 예술성, 섬세함, 배려심',
      weakness: '예민함, 변덕, 의심 많음'
    },
    '무': {
      basic: '신뢰감을 주고 포용력이 있으며 중심을 잘 잡습니다. 책임감이 강하고 실용적입니다.',
      strength: '신뢰성, 포용력, 균형감, 실용성',
      weakness: '완고함, 변화 거부, 보수적'
    },
    '기': {
      basic: '꼼꼼하고 세심하며 계획적입니다. 분석력이 뛰어나고 완벽을 추구합니다.',
      strength: '분석력, 계획성, 세심함, 논리성',
      weakness: '걱정 많음, 소심함, 비판적'
    },
    '경': {
      basic: '결단력이 있고 추진력이 강합니다. 정의롭고 명예를 중시합니다.',
      strength: '결단력, 정의감, 추진력, 용기',
      weakness: '경직성, 고집, 공격적'
    },
    '신': {
      basic: '예리하고 민첩하며 변화를 추구합니다. 개혁적이고 진보적인 사고를 합니다.',
      strength: '민첩성, 개혁성, 통찰력, 적응력',
      weakness: '변덕, 인내 부족, 비판적'
    },
    '임': {
      basic: '지혜롭고 학구적이며 사고가 깊습니다. 유연하고 포용력이 있습니다.',
      strength: '지혜, 포용력, 유연성, 통찰력',
      weakness: '우유부단, 게으름, 회피적'
    },
    '계': {
      basic: '섬세하고 직관적이며 창의적입니다. 상상력이 풍부하고 감성적입니다.',
      strength: '창의성, 직관력, 섬세함, 친화력',
      weakness: '감정적, 의존적, 현실감 부족'
    }
  };

  // 오행 균형에 따른 해석
  static interpretFiveElements(elements: { [key: string]: number }): string {
    const total = Object.values(elements).reduce((sum, count) => sum + count, 0);
    const balance = Object.entries(elements).map(([element, count]) => ({
      element,
      percentage: (count / total) * 100
    }));

    let interpretation = '오행 분석:\n';
    
    // 가장 많은 오행
    const dominant = balance.reduce((max, curr) => 
      curr.percentage > max.percentage ? curr : max
    );
    
    // 가장 적은 오행
    const lacking = balance.reduce((min, curr) => 
      curr.percentage < min.percentage ? curr : min
    );

    if (dominant.percentage > 40) {
      interpretation += `${dominant.element}(${dominant.element === '목' ? '木' : 
        dominant.element === '화' ? '火' : 
        dominant.element === '토' ? '土' : 
        dominant.element === '금' ? '金' : '水'})의 기운이 강하여 `;
      
      switch(dominant.element) {
        case '목':
          interpretation += '성장과 발전의 에너지가 풍부합니다. 진취적이고 적극적인 성향이 강합니다.\n';
          break;
        case '화':
          interpretation += '열정과 활력이 넘칩니다. 밝고 긍정적이며 표현력이 풍부합니다.\n';
          break;
        case '토':
          interpretation += '안정적이고 신뢰할 수 있습니다. 중재 능력이 뛰어나고 포용력이 있습니다.\n';
          break;
        case '금':
          interpretation += '결단력과 추진력이 강합니다. 원칙적이고 정의로운 성향입니다.\n';
          break;
        case '수':
          interpretation += '지혜롭고 유연합니다. 적응력이 뛰어나고 사고가 깊습니다.\n';
          break;
      }
    }

    if (lacking.percentage < 10) {
      interpretation += `${lacking.element}의 기운이 부족하여 `;
      
      switch(lacking.element) {
        case '목':
          interpretation += '때로는 추진력이나 성장 에너지가 부족할 수 있습니다.\n';
          break;
        case '화':
          interpretation += '열정이나 표현력이 부족할 수 있습니다.\n';
          break;
        case '토':
          interpretation += '안정감이나 중심이 부족할 수 있습니다.\n';
          break;
        case '금':
          interpretation += '결단력이나 실행력이 부족할 수 있습니다.\n';
          break;
        case '수':
          interpretation += '유연성이나 적응력이 부족할 수 있습니다.\n';
          break;
      }
    }

    return interpretation;
  }

  // 직업 적성 해석
  static interpretCareer(dayHeavenly: string, elements: { [key: string]: number }): string {
    const careerMap = {
      '갑': ['경영자', 'CEO', '정치인', '교육자', '연구원'],
      '을': ['예술가', '디자이너', '상담사', '의료인', '교육자'],
      '병': ['연예인', '마케터', '영업', '강사', '이벤트 기획자'],
      '정': ['예술가', '작가', '심리상담사', '디자이너', '뷰티 관련'],
      '무': ['공무원', '교육자', '부동산', '건축', '농업'],
      '기': ['회계사', '분석가', '연구원', '의사', '법조인'],
      '경': ['군인', '경찰', '법조인', '외과의사', '경영자'],
      '신': ['금융인', 'IT 전문가', '투자자', '컨설턴트', '변호사'],
      '임': ['학자', '연구원', '작가', '종교인', '철학자'],
      '계': ['예술가', '심리학자', '간호사', '사회복지사', '교육자']
    };

    const careers = careerMap[dayHeavenly] || [];
    
    return `직업 적성:\n적합한 분야: ${careers.join(', ')}\n` +
           `${dayHeavenly}일간의 특성상 ${careers[0]}와 같은 분야에서 뛰어난 능력을 발휘할 수 있습니다.`;
  }

  // 관계 운 해석
  static interpretRelationship(gender: string, dayHeavenly: string): string {
    const isYang = ['갑', '병', '무', '경', '임'].includes(dayHeavenly);
    
    let interpretation = '연애/결혼운:\n';
    
    if (isYang) {
      interpretation += '적극적이고 주도적인 연애 스타일을 가지고 있습니다. ';
      interpretation += gender === '남' ? 
        '남성적인 매력이 강하고 리드하는 것을 선호합니다.' :
        '독립적이고 주체적인 여성으로 평등한 관계를 추구합니다.';
    } else {
      interpretation += '감성적이고 배려심 깊은 연애 스타일을 가지고 있습니다. ';
      interpretation += gender === '남' ?
        '섬세하고 로맨틱한 남성으로 상대방을 배려합니다.' :
        '여성스러운 매력이 있고 조화로운 관계를 추구합니다.';
    }
    
    return interpretation;
  }

  // 재물운 해석
  static interpretWealth(dayHeavenly: string, yearEarthly: string): string {
    const wealthLuck = {
      '갑': '꾸준한 노력으로 안정적인 재물을 모을 수 있습니다.',
      '을': '유연한 대처로 다양한 수입원을 만들 수 있습니다.',
      '병': '인맥을 통한 재물 획득 기회가 많습니다.',
      '정': '예술이나 창의적인 분야에서 재물운이 좋습니다.',
      '무': '부동산이나 안정적인 투자로 재물을 늘릴 수 있습니다.',
      '기': '계획적인 저축과 투자로 재물을 모을 수 있습니다.',
      '경': '과감한 투자와 사업으로 큰 재물을 얻을 수 있습니다.',
      '신': '금융이나 투자 분야에서 재능을 발휘합니다.',
      '임': '지적 재산이나 교육 분야에서 재물운이 좋습니다.',
      '계': '직관을 활용한 투자로 재물을 늘릴 수 있습니다.'
    };

    return `재물운:\n${wealthLuck[dayHeavenly] || '꾸준한 노력으로 재물을 모을 수 있습니다.'}`;
  }

  // 건강운 해석
  static interpretHealth(elements: { [key: string]: number }): string {
    const total = Object.values(elements).reduce((sum, count) => sum + count, 0);
    let interpretation = '건강운:\n';
    
    // 오행 불균형에 따른 건강 주의사항
    Object.entries(elements).forEach(([element, count]) => {
      const percentage = (count / total) * 100;
      
      if (percentage > 40) {
        switch(element) {
          case '목':
            interpretation += '간, 담낭, 근육, 눈 건강에 주의하세요. 스트레스 관리가 중요합니다.\n';
            break;
          case '화':
            interpretation += '심장, 소장, 혈액순환에 주의하세요. 과로를 피하고 충분한 휴식이 필요합니다.\n';
            break;
          case '토':
            interpretation += '비장, 위장, 소화기관에 주의하세요. 규칙적인 식사가 중요합니다.\n';
            break;
          case '금':
            interpretation += '폐, 대장, 호흡기에 주의하세요. 공기 좋은 곳에서 운동하세요.\n';
            break;
          case '수':
            interpretation += '신장, 방광, 비뇨기에 주의하세요. 충분한 수분 섭취가 필요합니다.\n';
            break;
        }
      }
    });
    
    return interpretation || '전반적으로 건강한 체질입니다. 규칙적인 생활습관을 유지하세요.';
  }

  // 올해 운세 (간단한 버전)
  static interpretYearlyFortune(currentYear: number, birthYear: number): string {
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
      '준비와 계획의 해입니다. 미래를 위한 준비를 철저히 하세요.'
    ];
    
    return `${currentYear}년 운세:\n${fortunes[cycle]}`;
  }
}