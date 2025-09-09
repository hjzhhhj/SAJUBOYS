import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import SajuCharts from "../components/SajuCharts";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

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
`;

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
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: black;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  padding: 2rem 1rem;
  width: 100%;
`;

const GradientCircle1 = styled.div`
  position: fixed;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0) 0%,
    rgba(98, 0, 255, 0.31) 50%,
    #0e0025 100%
  );
  top: -200px;
  right: -100px;
  animation: ${float1} 15s ease-in-out infinite;
  filter: blur(40px);
  pointer-events: none;

  @media (min-width: 768px) {
    width: 800px;
    height: 800px;
    top: -300px;
    right: -200px;
  }
`;

const GradientCircle2 = styled.div`
  position: fixed;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0) 0%,
    rgba(98, 0, 255, 0.31) 50%,
    #0e0025 100%
  );
  bottom: -150px;
  left: 100px;
  animation: ${float2} 18s ease-in-out infinite;
  filter: blur(40px);
  pointer-events: none;

  @media (min-width: 768px) {
    width: 800px;
    height: 800px;
    bottom: -200px;
    left: 300px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 900px;
  padding: 0 1rem;
  z-index: 1;
  margin-top: 3rem;

  @media (min-width: 768px) {
    padding: 0 2rem;
  }
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  text-align: center;
  font-family: "Cinzel Decorative", cursive;

  @media (min-width: 768px) {
    font-size: 3.5rem;
  }

  @media (min-width: 1024px) {
    font-size: 4rem;
  }
`;

const ResultCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #ffffff;
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  color: #150137;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const InfoItem = styled.div`
  color: #333;
  font-size: 1rem;

  span {
    color: #666;
    margin-right: 0.5rem;
    font-weight: 600;
  }
`;

const PillarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 2rem 0;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Pillar = styled.div`
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
`;

const PillarTitle = styled.h3`
  color: #150137;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const PillarContent = styled.div`
  color: #333;
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const PillarSub = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const Description = styled.p`
  color: #333;
  line-height: 1.8;
  margin: 1rem 0;
  font-size: 1rem;
  white-space: pre-line;
`;

const FiveElementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin: 1rem 0;

  @media (min-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

const ElementItem = styled.div`
  background: ${(props) => {
    switch (props.element) {
      case "목":
        return "#2ecc71";
      case "화":
        return "#e74c3c";
      case "토":
        return "#f39c12";
      case "금":
        return "#95a5a6";
      case "수":
        return "#3498db";
      default:
        return "#95a5a6";
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
`;

const DaeunGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 1rem 0;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

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
`;

const AdvancedCard = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const AdvancedTitle = styled.h3`
  color: #333;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
`;

const AdvancedContent = styled.div`
  color: #666;
  line-height: 1.8;
  font-size: 1rem;
  padding-top: 1rem;
`;

const ZodiacCard = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 2.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ZodiacAnimal = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 3rem;
  justify-content: center;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    width: auto;
  }
`;

const Button = styled.button`
  background-color: ${(props) => (props.primary ? "#ffffff20" : "transparent")};
  color: white;
  border: 1px solid #ffffff;
  border-radius: 100px;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0 1.5rem;
  height: 3.5rem;
  min-width: 180px;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    background: #ffffff30;
  }

  @media (min-width: 768px) {
    font-size: 1.25rem;
    padding: 0 2rem;
    height: 3.75rem;
    min-width: 200px;
    width: auto;
  }
`;

function SajuResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resultData, setResultData] = useState(null);
  const [setSaving] = useState(false);

  useEffect(() => {
    // location.state에서 데이터 받기
    if (location.state) {
      const data = location.state;

      // 날짜 형식 변환
      let formattedDate = data.birthDate;
      if (data.birthDate && data.birthDate.includes("-")) {
        const [year, month, day] = data.birthDate.split("-");
        formattedDate = `${year}년 ${month}월 ${day}일`;
      }

      // 시간 표시 형식 변환
      let formattedTime = null;
      if (data.isTimeUnknown) {
        formattedTime = "시간 모름";
      } else if (data.birthTime) {
        const timeMap = {
          "00:00": "자시 (23:00 - 01:00)",
          "02:00": "축시 (01:00 - 03:00)",
          "04:00": "인시 (03:00 - 05:00)",
          "06:00": "묘시 (05:00 - 07:00)",
          "08:00": "진시 (07:00 - 09:00)",
          "10:00": "사시 (09:00 - 11:00)",
          "12:00": "오시 (11:00 - 13:00)",
          "14:00": "미시 (13:00 - 15:00)",
          "16:00": "신시 (15:00 - 17:00)",
          "18:00": "유시 (17:00 - 19:00)",
          "20:00": "술시 (19:00 - 21:00)",
          "22:00": "해시 (21:00 - 23:00)",
        };
        formattedTime = timeMap[data.birthTime] || data.birthTime;
      }

      // 데이터 설정
      setResultData({
        ...data,
        birthDate: formattedDate,
        birthTime: formattedTime,
        gender:
          data.gender === "남"
            ? "남성"
            : data.gender === "여"
            ? "여성"
            : data.gender,
        isTimeUnknown: data.isTimeUnknown,
      });
    } else {
      // 더미 데이터
      setResultData({
        name: "홍길동",
        gender: "남성",
        birthDate: "1990년 1월 1일",
        birthTime: "오시 (11:00 - 13:00)",
        calendarType: "양력",
        city: "서울",
        fourPillars: {
          year: { heaven: "경", earth: "오" },
          month: { heaven: "정", earth: "축" },
          day: { heaven: "갑", earth: "자" },
          time: { heaven: "경", earth: "오" },
        },
        interpretation: {
          personality:
            "당신은 리더십이 강하고 창의적인 성격을 가지고 있습니다. 타고난 카리스마로 주변 사람들을 이끄는 능력이 있으며, 새로운 아이디어를 실현하는 데 탁월한 재능을 보입니다.",
          career:
            "경영, 기획, 창업 분야에서 큰 성공을 거둘 수 있습니다. 특히 혁신적인 아이디어가 필요한 분야에서 두각을 나타낼 것입니다.",
          relationship:
            "열정적이고 헌신적인 연애를 하는 타입입니다. 파트너와의 소통을 중요시하며, 서로를 존중하는 관계를 추구합니다.",
          fortune:
            "올해는 새로운 기회가 많이 찾아올 시기입니다. 과감한 도전이 좋은 결과를 가져올 수 있으니, 망설이지 말고 행동하세요.",
        },
      });
    }
  }, [location.state]);

  const handleNewReading = () => {
    navigate("/saju-input");
  };

  const handleSaveResult = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    if (!resultData._id) {
      alert("저장할 수 있는 결과가 아닙니다.");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:3001/saju/${resultData._id}/save`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("결과가 성공적으로 저장되었습니다!");
      }
    } catch {
      alert("결과 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (!resultData) {
    return (
      <Container>
        <ContentWrapper>
          <Title>데이터를 불러오는 중...</Title>
        </ContentWrapper>
      </Container>
    );
  }

  return (
    <Container>
      <GradientCircle1 />
      <GradientCircle2 />
      <ContentWrapper>
        <ResultCard>
          <SectionTitle>기본 정보</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <span>이름:</span> {resultData.name}
            </InfoItem>
            <InfoItem>
              <span>성별:</span> {resultData.gender}
            </InfoItem>
            <InfoItem>
              <span>생년월일:</span> {resultData.birthDate} (
              {resultData.calendarType})
            </InfoItem>
            {resultData.birthTime && (
              <InfoItem>
                <span>태어난 시간:</span> {resultData.birthTime}
              </InfoItem>
            )}
            <InfoItem>
              <span>출생지:</span> {resultData.city}
            </InfoItem>
            {resultData.interpretation?.advancedAnalysis?.zodiac && (
              <InfoItem>
                <span>띠:</span>{" "}
                {resultData.interpretation.advancedAnalysis.zodiac.animal}띠
              </InfoItem>
            )}
          </InfoGrid>
        </ResultCard>

        <ResultCard>
          <SectionTitle>사주 팔자</SectionTitle>
          <PillarGrid>
            <Pillar>
              <PillarTitle>년주</PillarTitle>
              <PillarContent>
                {resultData.fourPillars.year.heaven}
                {resultData.fourPillars.year.earth}
              </PillarContent>
              <PillarSub>년간 년지</PillarSub>
            </Pillar>
            <Pillar>
              <PillarTitle>월주</PillarTitle>
              <PillarContent>
                {resultData.fourPillars.month.heaven}
                {resultData.fourPillars.month.earth}
              </PillarContent>
              <PillarSub>월간 월지</PillarSub>
            </Pillar>
            <Pillar>
              <PillarTitle>일주</PillarTitle>
              <PillarContent>
                {resultData.fourPillars.day.heaven}
                {resultData.fourPillars.day.earth}
              </PillarContent>
              <PillarSub>일간 일지</PillarSub>
            </Pillar>
            {!resultData.isTimeUnknown && resultData.fourPillars.time && (
              <Pillar>
                <PillarTitle>시주</PillarTitle>
                <PillarContent>
                  {resultData.fourPillars.time.heaven}
                  {resultData.fourPillars.time.earth}
                </PillarContent>
                <PillarSub>시간 시지</PillarSub>
              </Pillar>
            )}
          </PillarGrid>
        </ResultCard>

        {(resultData.elements ||
          resultData.yinYang ||
          resultData.fourPillars) && (
          <ResultCard>
            <SectionTitle>사주 분석 차트</SectionTitle>
            <SajuCharts
              elements={resultData.elements}
              yinYang={resultData.yinYang}
              fourPillars={resultData.fourPillars}
            />
          </ResultCard>
        )}

        {resultData.elements && (
          <ResultCard>
            <SectionTitle>오행 분석</SectionTitle>
            <FiveElementsGrid>
              {Object.entries(resultData.elements).map(([element, count]) => (
                <ElementItem key={element} element={element}>
                  <div className="element-name">{element}</div>
                  <div className="element-count">{count}</div>
                </ElementItem>
              ))}
            </FiveElementsGrid>
            {resultData.interpretation?.elementBalance && (
              <Description>
                {resultData.interpretation.elementBalance
                  .split("\n")
                  .map((line, index) => (
                    <span key={index}>
                      <br />
                      {line}
                    </span>
                  ))}
              </Description>
            )}
          </ResultCard>
        )}

        {resultData.saeun && (
          <ResultCard>
            <SectionTitle>2025년 세운</SectionTitle>
            <Description>
              올해의 세운: {resultData.saeun.heaven}
              {resultData.saeun.earth}
            </Description>
          </ResultCard>
        )}

        <ResultCard>
          <SectionTitle>총운</SectionTitle>
          <Description>{resultData.interpretation.fortune}</Description>
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

        {/* 띠 카드 섹션 */}
        {resultData.interpretation?.advancedAnalysis?.zodiac && (
          <ZodiacCard>
            <ZodiacAnimal>
              {getZodiacEmoji(
                resultData.interpretation.advancedAnalysis.zodiac.animal
              )}
            </ZodiacAnimal>
            <h3
              style={{
                fontSize: "1.5rem",
                marginBottom: "1rem",
                fontWeight: "700",
                color: "#333",
              }}
            >
              {resultData.interpretation.advancedAnalysis.zodiac.animal}띠의
              특성
            </h3>
            <p
              style={{
                lineHeight: "1.8",
                fontSize: "1rem",
                marginBottom: "1.5rem",
                color: "#666",
              }}
            >
              {resultData.interpretation.advancedAnalysis.zodiac.personality}
            </p>
            <div
              style={{
                borderTop: "1px solid #e0e0e0",
                paddingTop: "1.5rem",
                marginTop: "1.5rem",
              }}
            >
              <h4
                style={{
                  fontSize: "1.1rem",
                  marginBottom: "1rem",
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                {resultData.interpretation.advancedAnalysis.zodiac.animal}띠
                상세 분석
              </h4>
              <div
                style={{
                  textAlign: "left",
                  fontSize: "1rem",
                  lineHeight: "1.8",
                  color: "#666",
                }}
              >
                <div style={{ marginBottom: "1rem" }}>
                  <strong>성격적 특징:</strong>{" "}
                  {
                    getZodiacDetails(
                      resultData.interpretation.advancedAnalysis.zodiac.animal
                    ).personality
                  }
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <strong>장점:</strong>{" "}
                  {
                    getZodiacDetails(
                      resultData.interpretation.advancedAnalysis.zodiac.animal
                    ).strengths
                  }
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <strong>주의할 점:</strong>{" "}
                  {
                    getZodiacDetails(
                      resultData.interpretation.advancedAnalysis.zodiac.animal
                    ).weaknesses
                  }
                </div>
                <div>
                  <strong>행운의 방향:</strong>{" "}
                  {
                    getZodiacDetails(
                      resultData.interpretation.advancedAnalysis.zodiac.animal
                    ).lucky
                  }
                </div>
              </div>
            </div>
          </ZodiacCard>
        )}

        {/* 대운 섹션 */}
        {resultData.daeun && resultData.daeun.length > 0 && (
          <ResultCard>
            <SectionTitle>대운</SectionTitle>
            <DaeunGrid>
              {resultData.daeun.slice(0, 8).map((item, index) => (
                <DaeunItem key={index}>
                  <div className="age">{item.age}세부터</div>
                  <div className="pillar">
                    {item.pillar.heaven}
                    {item.pillar.earth}
                  </div>
                </DaeunItem>
              ))}
            </DaeunGrid>
          </ResultCard>
        )}

        {/* 고급 해석 섹션 */}
        {resultData.interpretation?.advancedAnalysis && (
          <>
            {/* 심화 해석 섹션 */}
            {resultData.interpretation.advancedAnalysis.specialPattern && (
              <AdvancedCard>
                <AdvancedTitle>특별한 격국</AdvancedTitle>
                <AdvancedContent>
                  {resultData.interpretation.advancedAnalysis.specialPattern}
                </AdvancedContent>
              </AdvancedCard>
            )}

            {resultData.interpretation.advancedAnalysis.daeunAnalysis && (
              <AdvancedCard>
                <AdvancedTitle>현재 대운 분석</AdvancedTitle>
                <AdvancedContent>
                  {resultData.interpretation.advancedAnalysis.daeunAnalysis}
                </AdvancedContent>
              </AdvancedCard>
            )}

            {/* 조언 섹션 */}
            {resultData.interpretation.advancedAnalysis.timelyFortune
              ?.advice && (
              <ResultCard>
                <SectionTitle>올해 행동 가이드</SectionTitle>
                <Description>
                  {
                    resultData.interpretation.advancedAnalysis.timelyFortune
                      .advice
                  }
                </Description>
              </ResultCard>
            )}
          </>
        )}

        <ButtonGroup>
          <Button primary onClick={handleSaveResult}>
            결과 저장하기
          </Button>
          <Button onClick={handleNewReading}>새로운 사주 보기</Button>
        </ButtonGroup>
      </ContentWrapper>
    </Container>
  );
}

// 띠별 이모지 반환 함수
function getZodiacEmoji(animal) {
  const zodiacEmojis = {
    쥐: "🐭",
    소: "🐮",
    호랑이: "🐯",
    토끼: "🐰",
    용: "🐲",
    뱀: "🐍",
    말: "🐴",
    양: "🐏",
    원숭이: "🐵",
    닭: "🐓",
    개: "🐕",
    돼지: "🐷",
  };
  return zodiacEmojis[animal] || "🌟";
}

// 띠별 상세 정보 반환 함수
function getZodiacDetails(animal) {
  const zodiacDetails = {
    쥐: {
      personality:
        "지혜롭고 재치가 뛰어나며, 빠른 판단력과 적응력을 가지고 있습니다. 사교성이 좋고 리더십이 있어 어떤 상황에서도 중심 역할을 합니다.",
      strengths:
        "영리하고 근면하며, 세심한 관찰력과 계획성을 갖추고 있어 어떤 환경에서도 성공할 수 있는 능력이 있습니다. 재물 운용 능력이 뛰어납니다.",
      weaknesses:
        "때로는 지나치게 신중하거나 소심할 수 있으니, 과감한 결단이 필요한 순간을 놓치지 않도록 주의해야 합니다.",
      lucky:
        "북쪽이 길하며, 파란색과 검은색이 행운을 가져다 줍니다. 숫자 1과 4가 행운의 숫자입니다.",
    },
    소: {
      personality:
        "성실하고 꾸준하며, 강한 인내심과 책임감을 가지고 있습니다. 신중하고 보수적이지만 한번 결정하면 끝까지 밀고 나가는 추진력이 있습니다.",
      strengths:
        "믿음직스럽고 안정적이며, 꾸준한 노력으로 큰 성취를 이루는 타입입니다. 리더십과 조직력이 뛰어납니다.",
      weaknesses:
        "고집이 세고 융통성이 부족할 수 있으니, 다른 사람의 의견도 경청하는 자세가 필요합니다.",
      lucky:
        "북동쪽이 길하며, 노란색과 갈색이 행운을 가져다 줍니다. 숫자 1과 9가 행운의 숫자입니다.",
    },
    호랑이: {
      personality:
        "용감하고 대담하며, 강한 리더십과 카리스마를 가지고 있습니다. 정의감이 강하고 독립적이며 모험을 즐깁니다.",
      strengths:
        "추진력이 강하고 결단력이 있으며, 어려운 상황에서도 굴복하지 않는 강인한 정신력을 가지고 있습니다.",
      weaknesses:
        "성급하고 충동적일 수 있으니, 중요한 결정은 신중하게 내리는 것이 좋습니다.",
      lucky:
        "동쪽이 길하며, 파란색과 회색이 행운을 가져다 줍니다. 숫자 3과 8이 행운의 숫자입니다.",
    },
    토끼: {
      personality:
        "온화하고 섬세하며, 예술적 감각과 직관력이 뛰어납니다. 평화를 사랑하고 조화를 중시합니다.",
      strengths:
        "외교적이고 재치가 있으며, 타인과의 관계를 잘 유지합니다. 미적 감각이 뛰어나고 창의적입니다.",
      weaknesses:
        "우유부단하고 소극적일 수 있으니, 자신감을 가지고 적극적으로 행동하는 것이 중요합니다.",
      lucky:
        "동쪽이 길하며, 분홍색과 보라색이 행운을 가져다 줍니다. 숫자 3과 4가 행운의 숫자입니다.",
    },
    용: {
      personality:
        "카리스마가 넘치고 야망이 크며, 타고난 리더십을 가지고 있습니다. 자신감이 넘치고 열정적입니다.",
      strengths:
        "창의적이고 혁신적이며, 큰 그림을 그리는 능력이 뛰어납니다. 목표를 향한 추진력이 강합니다.",
      weaknesses:
        "자만심이 강하고 독선적일 수 있으니, 겸손한 자세를 유지하는 것이 중요합니다.",
      lucky:
        "동남쪽이 길하며, 금색과 은색이 행운을 가져다 줍니다. 숫자 1과 6이 행운의 숫자입니다.",
    },
    뱀: {
      personality:
        "지혜롭고 신비로우며, 깊은 통찰력과 직관력을 가지고 있습니다. 침착하고 차분한 성격입니다.",
      strengths:
        "분석력이 뛰어나고 전략적 사고를 잘합니다. 목표를 위해 꾸준히 노력하는 인내심이 있습니다.",
      weaknesses:
        "의심이 많고 질투심이 강할 수 있으니, 타인을 신뢰하는 법을 배우는 것이 좋습니다.",
      lucky:
        "남쪽이 길하며, 빨간색과 노란색이 행운을 가져다 줍니다. 숫자 2와 7이 행운의 숫자입니다.",
    },
    말: {
      personality:
        "자유분방하고 활동적이며, 모험심과 독립심이 강합니다. 사교적이고 낙천적입니다.",
      strengths:
        "열정적이고 추진력이 있으며, 빠른 판단력과 행동력을 가지고 있습니다. 커뮤니케이션 능력이 뛰어납니다.",
      weaknesses:
        "인내심이 부족하고 변덕스러울 수 있으니, 한 가지 일에 집중하는 노력이 필요합니다.",
      lucky:
        "남쪽이 길하며, 보라색과 갈색이 행운을 가져다 줍니다. 숫자 2와 3이 행운의 숫자입니다.",
    },
    양: {
      personality:
        "온순하고 예술적이며, 창의력과 상상력이 풍부합니다. 타인을 배려하고 평화를 추구합니다.",
      strengths:
        "친절하고 관대하며, 예술적 재능이 뛰어납니다. 타인과의 조화를 잘 이룹니다.",
      weaknesses:
        "결단력이 부족하고 의존적일 수 있으니, 독립적인 판단력을 기르는 것이 중요합니다.",
      lucky:
        "남서쪽이 길하며, 녹색과 빨간색이 행운을 가져다 줍니다. 숫자 3과 9가 행운의 숫자입니다.",
    },
    원숭이: {
      personality:
        "영리하고 재치가 있으며, 호기심이 많고 다재다능합니다. 유머 감각이 뛰어나고 사교적입니다.",
      strengths:
        "문제 해결 능력이 뛰어나고 적응력이 강합니다. 창의적이고 혁신적인 아이디어를 잘 냅니다.",
      weaknesses:
        "경솔하고 참을성이 부족할 수 있으니, 신중함과 인내심을 기르는 것이 필요합니다.",
      lucky:
        "서쪽이 길하며, 흰색과 금색이 행운을 가져다 줍니다. 숫자 4와 9가 행운의 숫자입니다.",
    },
    닭: {
      personality:
        "부지런하고 성실하며, 완벽주의적 성향이 있습니다. 정직하고 용감하며 책임감이 강합니다.",
      strengths:
        "관찰력이 뛰어나고 세심합니다. 시간 관리를 잘하고 효율적으로 일을 처리합니다.",
      weaknesses:
        "비판적이고 까다로울 수 있으니, 타인의 단점보다 장점을 보는 연습이 필요합니다.",
      lucky:
        "서쪽이 길하며, 금색과 갈색이 행운을 가져다 줍니다. 숫자 5와 7이 행운의 숫자입니다.",
    },
    개: {
      personality:
        "충성스럽고 정직하며, 정의감이 강합니다. 신뢰할 수 있고 책임감이 있습니다.",
      strengths:
        "성실하고 근면하며, 타인을 잘 돕습니다. 공정하고 원칙적입니다.",
      weaknesses:
        "보수적이고 걱정이 많을 수 있으니, 긍정적인 사고를 유지하는 것이 중요합니다.",
      lucky:
        "북서쪽이 길하며, 빨간색과 녹색이 행운을 가져다 줍니다. 숫자 3과 4가 행운의 숫자입니다.",
    },
    돼지: {
      personality:
        "관대하고 낙천적이며, 정이 많고 순수합니다. 행복을 추구하고 즐거움을 아는 성격입니다.",
      strengths:
        "성실하고 책임감이 있으며, 타인에게 관대합니다. 재물운이 좋고 복이 많습니다.",
      weaknesses:
        "게으르고 낭비가 심할 수 있으니, 절제하는 습관을 기르는 것이 좋습니다.",
      lucky:
        "북쪽이 길하며, 노란색과 회색이 행운을 가져다 줍니다. 숫자 2와 5가 행운의 숫자입니다.",
    },
  };
  return (
    zodiacDetails[animal] || {
      personality: "특별한 재능과 능력을 가지고 있습니다.",
      strengths: "독특한 개성과 창의력을 바탕으로 성공할 수 있습니다.",
      weaknesses: "자신만의 길을 개척하되 타인과의 조화도 중요합니다.",
      lucky: "모든 방향이 길하며, 자신이 좋아하는 색이 행운을 가져다 줍니다.",
    }
  );
}

export default SajuResult;
