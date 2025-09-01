import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'

const float1 = keyframes`
  0%, 100% {
    transform: translateX(0) translateY(0);
  }
  25% {
    transform: translateX(-300px) translateY(100px);
  }
  50% {
    transform: translateX(-150px) translateY(-100px);
  }
  75% {
    transform: translateX(-250px) translateY(50px);
  }
`

const float2 = keyframes`
  0%, 100% {
    transform: translateX(0) translateY(0);
  }
  25% {
    transform: translateX(250px) translateY(-80px);
  }
  50% {
    transform: translateX(300px) translateY(100px);
  }
  75% {
    transform: translateX(150px) translateY(-50px);
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: black;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  padding: 2rem 0;
`

const GradientCircle1 = styled.div`
  position: absolute;
  width: 800px;
  height: 800px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0) 0%, rgba(98, 0, 255, 0.31) 50%, #0E0025 100%);
  top: -300px;
  right: -200px;
  animation: ${float1} 15s ease-in-out infinite;
  filter: blur(40px);
`

const GradientCircle2 = styled.div`
  position: absolute;
  width: 800px;
  height: 800px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0) 0%, rgba(98, 0, 255, 0.31) 50%, #0E0025 100%);
  bottom: -200px;
  left: 300px;
  animation: ${float2} 18s ease-in-out infinite;
  filter: blur(40px);
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 840px;
  z-index: 1;
  margin-top: 3rem;
`

const Title = styled.h1`
  color: white;
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 3rem;
  text-align: center;
`

const ResultCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #ffffff;
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  margin-bottom: 1.5rem;
`

const SectionTitle = styled.h2`
  color: #150137;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
`

const InfoItem = styled.div`
  color: #333;
  font-size: 1rem;
  
  span {
    color: #666;
    margin-right: 0.5rem;
    font-weight: 600;
  }
`

const PillarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin: 2rem 0;
`

const Pillar = styled.div`
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
`

const PillarTitle = styled.h3`
  color: #150137;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
`

const PillarContent = styled.div`
  color: #333;
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`

const PillarSub = styled.div`
  color: #666;
  font-size: 0.9rem;
`

const Description = styled.p`
  color: #333;
  line-height: 1.8;
  margin: 1rem 0;
  font-size: 1rem;
  white-space: pre-wrap;
`

const FiveElementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  margin: 1rem 0;
`

const ElementItem = styled.div`
  background: ${props => {
    switch(props.element) {
      case '목': return '#2ecc71';
      case '화': return '#e74c3c';
      case '토': return '#f39c12';
      case '금': return '#95a5a6';
      case '수': return '#3498db';
      default: return '#95a5a6';
    }
  }};
  color: white;
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  
  .element-name {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .element-count {
    font-size: 1.5rem;
    font-weight: bold;
  }
`

const DaeunGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin: 1rem 0;
`

const DaeunItem = styled.div`
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  
  .age {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  
  .pillar {
    color: #333;
    font-size: 1.2rem;
    font-weight: bold;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 3rem;
  justify-content: center;
`

const Button = styled.button`
  background-color: ${props => props.primary ? '#ffffff20' : 'transparent'};
  color: white;
  border: 1px solid #ffffff;
  border-radius: 100px;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0 2rem;
  height: 3.75rem;
  min-width: 200px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #ffffff30;
  }
`

function SajuResult() {
  const location = useLocation()
  const navigate = useNavigate()
  const [resultData, setResultData] = useState(null)

  useEffect(() => {
    // location.state에서 데이터 받기 또는 더미 데이터 설정
    if (location.state) {
      setResultData(location.state)
    } else {
      // 더미 데이터
      setResultData({
        name: '홍길동',
        gender: '남성',
        birthDate: '1990년 1월 1일',
        birthTime: '오시 (11:00 - 13:00)',
        calendarType: '양력',
        city: '서울',
        fourPillars: {
          year: { heaven: '경', earth: '오' },
          month: { heaven: '정', earth: '축' },
          day: { heaven: '갑', earth: '자' },
          time: { heaven: '경', earth: '오' }
        },
        interpretation: {
          personality: '당신은 리더십이 강하고 창의적인 성격을 가지고 있습니다. 타고난 카리스마로 주변 사람들을 이끄는 능력이 있으며, 새로운 아이디어를 실현하는 데 탁월한 재능을 보입니다.',
          career: '경영, 기획, 창업 분야에서 큰 성공을 거둘 수 있습니다. 특히 혁신적인 아이디어가 필요한 분야에서 두각을 나타낼 것입니다.',
          relationship: '열정적이고 헌신적인 연애를 하는 타입입니다. 파트너와의 소통을 중요시하며, 서로를 존중하는 관계를 추구합니다.',
          fortune: '올해는 새로운 기회가 많이 찾아올 시기입니다. 과감한 도전이 좋은 결과를 가져올 수 있으니, 망설이지 말고 행동하세요.'
        }
      })
    }
  }, [location.state])

  const handleNewReading = () => {
    navigate('/saju-input')
  }

  const handleSaveResult = () => {
    // TODO: 결과 저장 API 호출
    alert('결과가 저장되었습니다!')
  }

  if (!resultData) {
    return (
      <Container>
        <ContentWrapper>
          <Title>데이터를 불러오는 중...</Title>
        </ContentWrapper>
      </Container>
    )
  }

  return (
    <Container>
      <GradientCircle1 />
      <GradientCircle2 />
      <ContentWrapper>
        <Title>사주팔자 분석 결과</Title>
        
        <ResultCard>
          <SectionTitle>기본 정보</SectionTitle>
          <InfoGrid>
            <InfoItem><span>이름:</span> {resultData.name}</InfoItem>
            <InfoItem><span>성별:</span> {resultData.gender}</InfoItem>
            <InfoItem><span>생년월일:</span> {resultData.birthDate} ({resultData.calendarType})</InfoItem>
            <InfoItem><span>태어난 시간:</span> {resultData.birthTime}</InfoItem>
            <InfoItem><span>출생지:</span> {resultData.city}</InfoItem>
          </InfoGrid>
        </ResultCard>

        <ResultCard>
          <SectionTitle>사주 팔자</SectionTitle>
          <PillarGrid>
            <Pillar>
              <PillarTitle>년주</PillarTitle>
              <PillarContent>{resultData.fourPillars.year.heaven}{resultData.fourPillars.year.earth}</PillarContent>
              <PillarSub>년간 년지</PillarSub>
            </Pillar>
            <Pillar>
              <PillarTitle>월주</PillarTitle>
              <PillarContent>{resultData.fourPillars.month.heaven}{resultData.fourPillars.month.earth}</PillarContent>
              <PillarSub>월간 월지</PillarSub>
            </Pillar>
            <Pillar>
              <PillarTitle>일주</PillarTitle>
              <PillarContent>{resultData.fourPillars.day.heaven}{resultData.fourPillars.day.earth}</PillarContent>
              <PillarSub>일간 일지</PillarSub>
            </Pillar>
            <Pillar>
              <PillarTitle>시주</PillarTitle>
              <PillarContent>{resultData.fourPillars.time.heaven}{resultData.fourPillars.time.earth}</PillarContent>
              <PillarSub>시간 시지</PillarSub>
            </Pillar>
          </PillarGrid>
        </ResultCard>

        <ResultCard>
          <SectionTitle>성격 분석</SectionTitle>
          <Description>{resultData.interpretation.personality}</Description>
        </ResultCard>

        <ResultCard>
          <SectionTitle>직업 운</SectionTitle>
          <Description>{resultData.interpretation.career}</Description>
        </ResultCard>

        <ResultCard>
          <SectionTitle>연애 운</SectionTitle>
          <Description>{resultData.interpretation.relationship}</Description>
        </ResultCard>

        <ResultCard>
          <SectionTitle>총운</SectionTitle>
          <Description>{resultData.interpretation.fortune}</Description>
        </ResultCard>

        {resultData.interpretation.wealth && (
          <ResultCard>
            <SectionTitle>재물운</SectionTitle>
            <Description>{resultData.interpretation.wealth}</Description>
          </ResultCard>
        )}

        {resultData.interpretation.health && (
          <ResultCard>
            <SectionTitle>건강운</SectionTitle>
            <Description>{resultData.interpretation.health}</Description>
          </ResultCard>
        )}

        {resultData.elements && (
          <ResultCard>
            <SectionTitle>오행 분포</SectionTitle>
            <FiveElementsGrid>
              {Object.entries(resultData.elements).map(([element, count]) => (
                <ElementItem key={element} element={element}>
                  <div className="element-name">{element}</div>
                  <div className="element-count">{count}</div>
                </ElementItem>
              ))}
            </FiveElementsGrid>
          </ResultCard>
        )}

        {resultData.daeun && resultData.daeun.length > 0 && (
          <ResultCard>
            <SectionTitle>대운</SectionTitle>
            <DaeunGrid>
              {resultData.daeun.slice(0, 8).map((item, index) => (
                <DaeunItem key={index}>
                  <div className="age">{item.age}세부터</div>
                  <div className="pillar">
                    {item.pillar.heaven}{item.pillar.earth}
                  </div>
                </DaeunItem>
              ))}
            </DaeunGrid>
          </ResultCard>
        )}

        {resultData.saeun && (
          <ResultCard>
            <SectionTitle>올해 세운</SectionTitle>
            <Description>
              {new Date().getFullYear()}년 세운: {resultData.saeun.heaven}{resultData.saeun.earth}
            </Description>
          </ResultCard>
        )}

        <ButtonGroup>
          <Button primary onClick={handleSaveResult}>결과 저장하기</Button>
          <Button onClick={handleNewReading}>새로운 사주 보기</Button>
        </ButtonGroup>
      </ContentWrapper>
    </Container>
  )
}

export default SajuResult