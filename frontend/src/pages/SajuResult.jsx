import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import SajuCharts from '../components/SajuCharts'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

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

const AdvancedCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 2rem;
  color: white;
  margin-bottom: 1.5rem;
`

const AdvancedTitle = styled.h3`
  color: white;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const AdvancedContent = styled.div`
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.8;
  font-size: 1rem;
`

const ZodiacCard = styled.div`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 16px;
  padding: 2rem;
  color: white;
  margin-bottom: 1.5rem;
  text-align: center;
`

const ZodiacAnimal = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`

const TabContainer = styled.div`
  margin: 2rem 0;
`

const TabButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
`

const TabButton = styled.button`
  background: ${props => props.active ? '#150137' : 'transparent'};
  color: ${props => props.active ? 'white' : '#150137'};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  font-size: 1rem;
  font-weight: ${props => props.active ? '600' : '400'};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? '#150137' : '#f0f0f0'};
  }
`

const TabContent = styled.div`
  padding: 1.5rem 0;
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
  const { user } = useAuth()
  const [resultData, setResultData] = useState(null)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  useEffect(() => {
    // location.state에서 데이터 받기
    if (location.state) {
      const data = location.state
      
      // 날짜 형식 변환
      let formattedDate = data.birthDate
      if (data.birthDate && data.birthDate.includes('-')) {
        const [year, month, day] = data.birthDate.split('-')
        formattedDate = `${year}년 ${month}월 ${day}일`
      }
      
      // 시간 표시 형식 변환
      let formattedTime = data.birthTime
      if (data.birthTime) {
        const timeMap = {
          '00:00': '자시 (23:00 - 01:00)',
          '02:00': '축시 (01:00 - 03:00)',
          '04:00': '인시 (03:00 - 05:00)',
          '06:00': '묘시 (05:00 - 07:00)',
          '08:00': '진시 (07:00 - 09:00)',
          '10:00': '사시 (09:00 - 11:00)',
          '12:00': '오시 (11:00 - 13:00)',
          '14:00': '미시 (13:00 - 15:00)',
          '16:00': '신시 (15:00 - 17:00)',
          '18:00': '유시 (17:00 - 19:00)',
          '20:00': '술시 (19:00 - 21:00)',
          '22:00': '해시 (21:00 - 23:00)'
        }
        formattedTime = timeMap[data.birthTime] || data.birthTime
      }
      
      // 데이터 설정
      setResultData({
        ...data,
        birthDate: formattedDate,
        birthTime: formattedTime,
        gender: data.gender === '남' ? '남성' : data.gender === '여' ? '여성' : data.gender
      })
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

  const handleSaveResult = async () => {
    if (!user) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      return
    }
    
    if (!resultData._id) {
      alert('저장할 수 있는 결과가 아닙니다.')
      return
    }
    
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `http://localhost:3001/saju/${resultData._id}/save`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      if (response.data.success) {
        alert('결과가 성공적으로 저장되었습니다!')
      }
    } catch (error) {
      console.error('저장 오류:', error)
      alert('결과 저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
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
        
        {(resultData.elements || resultData.yinYang || resultData.fourPillars) && (
          <ResultCard>
            <SectionTitle>사주 분석 차트</SectionTitle>
            <SajuCharts 
              elements={resultData.elements}
              yinYang={resultData.yinYang}
              fourPillars={resultData.fourPillars}
            />
          </ResultCard>
        )}

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
        
        {/* 고급 해석 섹션 */}
        {resultData.interpretation?.advancedAnalysis && (
          <>
            {resultData.interpretation.advancedAnalysis.zodiac && (
              <ZodiacCard>
                <ZodiacAnimal>
                  {getZodiacEmoji(resultData.interpretation.advancedAnalysis.zodiac.animal)}
                </ZodiacAnimal>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                  {resultData.interpretation.advancedAnalysis.zodiac.animal}띠의 특성
                </h3>
                <p style={{ lineHeight: '1.8' }}>
                  {resultData.interpretation.advancedAnalysis.zodiac.personality}
                </p>
              </ZodiacCard>
            )}
            
            <TabContainer>
              <TabButtons>
                <TabButton 
                  active={activeTab === 'basic'} 
                  onClick={() => setActiveTab('basic')}
                >
                  기본 해석
                </TabButton>
                <TabButton 
                  active={activeTab === 'advanced'} 
                  onClick={() => setActiveTab('advanced')}
                >
                  심화 해석
                </TabButton>
                <TabButton 
                  active={activeTab === 'timely'} 
                  onClick={() => setActiveTab('timely')}
                >
                  시기별 운세
                </TabButton>
              </TabButtons>
              
              <TabContent>
                {activeTab === 'basic' && (
                  <div>
                    {/* 기본 해석은 이미 위에 표시됨 */}
                    <Description>기본 해석은 위의 카드에서 확인하실 수 있습니다.</Description>
                  </div>
                )}
                
                {activeTab === 'advanced' && (
                  <>
                    {resultData.interpretation.advancedAnalysis.specialPattern && (
                      <AdvancedCard>
                        <AdvancedTitle>🌟 특별한 격국</AdvancedTitle>
                        <AdvancedContent>
                          {resultData.interpretation.advancedAnalysis.specialPattern}
                        </AdvancedContent>
                      </AdvancedCard>
                    )}
                    
                    {resultData.interpretation.advancedAnalysis.daeunAnalysis && (
                      <AdvancedCard>
                        <AdvancedTitle>📅 현재 대운 분석</AdvancedTitle>
                        <AdvancedContent>
                          {resultData.interpretation.advancedAnalysis.daeunAnalysis}
                        </AdvancedContent>
                      </AdvancedCard>
                    )}
                    
                    {resultData.interpretation.advancedAnalysis.tenGodsAnalysis && (
                      <AdvancedCard>
                        <AdvancedTitle>⚡ 십신 관계 분석</AdvancedTitle>
                        <AdvancedContent>
                          {resultData.interpretation.advancedAnalysis.tenGodsAnalysis}
                        </AdvancedContent>
                      </AdvancedCard>
                    )}
                  </>
                )}
                
                {activeTab === 'timely' && resultData.interpretation.advancedAnalysis.timelyFortune && (
                  <>
                    <ResultCard>
                      <SectionTitle>올해 총운</SectionTitle>
                      <Description>
                        {resultData.interpretation.advancedAnalysis.timelyFortune.overall}
                      </Description>
                    </ResultCard>
                    
                    <ResultCard>
                      <SectionTitle>연애운</SectionTitle>
                      <Description>
                        {resultData.interpretation.advancedAnalysis.timelyFortune.love}
                      </Description>
                    </ResultCard>
                    
                    <ResultCard>
                      <SectionTitle>직업운</SectionTitle>
                      <Description>
                        {resultData.interpretation.advancedAnalysis.timelyFortune.career}
                      </Description>
                    </ResultCard>
                    
                    <ResultCard>
                      <SectionTitle>재물운</SectionTitle>
                      <Description>
                        {resultData.interpretation.advancedAnalysis.timelyFortune.wealth}
                      </Description>
                    </ResultCard>
                    
                    <ResultCard>
                      <SectionTitle>건강운</SectionTitle>
                      <Description>
                        {resultData.interpretation.advancedAnalysis.timelyFortune.health}
                      </Description>
                    </ResultCard>
                    
                    <ResultCard>
                      <SectionTitle>조언</SectionTitle>
                      <Description>
                        {resultData.interpretation.advancedAnalysis.timelyFortune.advice}
                      </Description>
                    </ResultCard>
                  </>
                )}
              </TabContent>
            </TabContainer>
          </>
        )}

        <ButtonGroup>
          <Button primary onClick={handleSaveResult}>결과 저장하기</Button>
          <Button onClick={handleNewReading}>새로운 사주 보기</Button>
        </ButtonGroup>
      </ContentWrapper>
    </Container>
  )
}

// 띠별 이모지 반환 함수
function getZodiacEmoji(animal) {
  const zodiacEmojis = {
    '쥐': '🐭',
    '소': '🐮',
    '호랑이': '🐯',
    '토끼': '🐰',
    '용': '🐲',
    '뱀': '🐍',
    '말': '🐴',
    '양': '🐏',
    '원숭이': '🐵',
    '닭': '🐓',
    '개': '🐕',
    '돼지': '🐷'
  }
  return zodiacEmojis[animal] || '🌟'
}

export default SajuResult