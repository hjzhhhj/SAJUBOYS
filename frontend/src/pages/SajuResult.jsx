import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import SajuCharts from "../components/SajuCharts";
import { useAuth } from "../context/AuthContext";
import api from "../services/api"; // axios 대신 api 인스턴스 사용

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
    rgba(135, 60, 255, 0.3) 50%,
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
    rgba(135, 60, 255, 0.3) 50%,
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
  max-width: 1400px;
  padding: 0 1rem;
  z-index: 1;
  margin-top: 3rem;

  @media (min-width: 768px) {
    padding: 0 2rem;
  }
`;

const SectionWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const Column = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 1024px) {
    max-width: ${(props) => (props.$sticky ? "45%" : "55%")};
  }
`;

const StickyColumn = styled(Column)`
  @media (min-width: 1024px) {
    position: sticky;
    top: 2rem;
    align-self: flex-start;
  }
`;

const SectionHeader = styled.div`
  width: 100%;
  padding: 1.5rem 2rem;
  background: ${(props) =>
    props.$variant === "immutable"
      ? "linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(102, 126, 234, 0.08))"
      : "linear-gradient(135deg, rgba(156, 102, 234, 0.15), rgba(156, 102, 234, 0.08))"};
  border: 1px solid
    ${(props) =>
      props.$variant === "immutable"
        ? "rgba(102, 126, 234, 0.3)"
        : "rgba(156, 102, 234, 0.3)"};
  border-radius: 12px;
  margin-bottom: 1.5rem;
  text-align: center;
  backdrop-filter: blur(10px);

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    background: linear-gradient(135deg, #cec2ff, #dab6ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    letter-spacing: 0.5px;
  }

  p {
    margin: 0.5rem 0 0 0;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.6);
  }
`;

const Divider = styled.div`
  width: 1px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.15) 20%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.15) 80%,
    rgba(255, 255, 255, 0.05) 100%
  );
  align-self: stretch;
  margin: 0 1.5rem;
  display: none;

  @media (min-width: 1024px) {
    display: block;
  }
`;

const Title = styled.h1`
  background: linear-gradient(135deg, #cec2ff, #dab6ff, #f9cbfe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2.2rem;
  font-weight: 900;
  margin: 0;
  margin-bottom: 3rem;
  font-family: "Cinzel", cursive;
  letter-spacing: 1.5px;
  position: relative;
  line-height: 1.2;

  @media (min-width: 769px) {
    font-size: 2.8rem;
    letter-spacing: 2px;
  }

  @media (min-width: 1025px) {
    font-size: 3.5rem;
  }
`;

const ResultCard = styled.div`
  background: ${(props) =>
    props.$variant === "immutable"
      ? "rgba(102, 126, 234, 0.08)"
      : props.$variant === "mutable"
      ? "rgba(156, 102, 234, 0.08)"
      : "rgba(255, 255, 255, 0.08)"};
  backdrop-filter: blur(10px);
  border: 1px solid
    ${(props) =>
      props.$variant === "immutable"
        ? "rgba(102, 126, 234, 0.3)"
        : props.$variant === "mutable"
        ? "rgba(156, 102, 234, 0.3)"
        : "rgba(255, 255, 255, 0.2)"};
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  letter-spacing: 0.5px;
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
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;

  span {
    color: rgba(255, 255, 255, 0.7);
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
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
`;

const PillarTitle = styled.h3`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const PillarContent = styled.div`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const PillarSub = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const Description = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
  margin: 1rem 0;
  font-size: 1rem;
  white-space: pre-line;
`;

const Highlight = styled.span`
  font-weight: 600;
  color: ${(props) => {
    const colors = {
      금: "#fff9c7",
      화: "#ffb3b3",
      목: "#b3f5b3",
      토: "#f5d9b3",
      수: "#b3d9ff",
      default: "#ffffff",
    };
    return colors[props.$element] || colors.default;
  }};
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
    const colors = {
      목: "rgba(46, 204, 113, 0.3)",
      화: "rgba(231, 76, 60, 0.3)",
      토: "rgba(243, 156, 18, 0.3)",
      금: "rgba(149, 165, 166, 0.3)",
      수: "rgba(52, 152, 219, 0.3)",
    };
    return colors[props.element] || "rgba(149, 165, 166, 0.3)";
  }};
  backdrop-filter: blur(10px);
  border: 1px solid
    ${(props) => {
      const colors = {
        목: "rgba(46, 204, 113, 0.5)",
        화: "rgba(231, 76, 60, 0.5)",
        토: "rgba(243, 156, 18, 0.5)",
        금: "rgba(149, 165, 166, 0.5)",
        수: "rgba(52, 152, 219, 0.5)",
      };
      return colors[props.element] || "rgba(149, 165, 166, 0.5)";
    }};
  color: rgba(255, 255, 255, 0.9);
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => {
      const colors = {
        목: "rgba(46, 204, 113, 0.4)",
        화: "rgba(231, 76, 60, 0.4)",
        토: "rgba(243, 156, 18, 0.4)",
        금: "rgba(149, 165, 166, 0.4)",
        수: "rgba(52, 152, 219, 0.4)",
      };
      return colors[props.element] || "rgba(149, 165, 166, 0.4)";
    }};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px
      ${(props) => {
        const colors = {
          목: "rgba(46, 204, 113, 0.3)",
          화: "rgba(231, 76, 60, 0.3)",
          토: "rgba(243, 156, 18, 0.3)",
          금: "rgba(149, 165, 166, 0.3)",
          수: "rgba(52, 152, 219, 0.3)",
        };
        return colors[props.element] || "rgba(149, 165, 166, 0.3)";
      }};
  }

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
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;

  .age {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .pillar {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.2rem;
    font-weight: bold;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2rem;
  justify-content: center;
  width: 100%;
  padding: 0 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    width: auto;
    padding: 0;
  }
`;

const Button = styled.button`
  background: rgba(190, 144, 255, 0.3);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(200, 160, 255, 0.5);
  border-radius: 100px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  padding: 1rem 2.5rem;
  min-width: 180px;
  transition: all 0.3s ease;
  width: 100%;
  box-shadow: 0 6px 25px rgba(150, 100, 200, 0.2);

  &:hover {
    background: rgba(190, 150, 250, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(150, 100, 200, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 6px 25px rgba(150, 100, 200, 0.2);
  }

  @media (min-width: 768px) {
    width: auto;
  }
`;

const highlightText = (text) => {
  if (!text || typeof text !== "string") return text;

  const detectElement = (str, type) => {
    // element type일 때만 오행 색상 감지, 나머지는 모두 default
    if (type !== "element") return "default";

    if (/금|金|Metal/i.test(str)) return "금";
    if (/화|火|Fire/i.test(str)) return "화";
    if (/목|木|Wood/i.test(str)) return "목";
    if (/토|土|Earth/i.test(str)) return "토";
    if (/수|水|Water/i.test(str)) return "수";
    return "default";
  };

  const keywordPatterns = [
    {
      pattern:
        /(?:금|金|Metal|화|火|Fire|목|木|Wood|토|土|Earth|수|水|Water)\s*(?:\([^)]+\))?\s*(?:기운이?\s*)?(?:약한|강한|부족|과다|지나치게\s강한)\s*(?:체질|사람)?/gi,
      type: "element",
    },
    {
      pattern: /◆\s*(?:목|화|토|금|수)\((?:Wood|Fire|Earth|Metal|Water)\)\s*(?:과다|부족):[^\n]+/g,
      type: "element",
    },
    { pattern: /양기가\s*강한\s*사주입니다\s*\([^)]+\)/g, type: "yinyang" },
    { pattern: /음기가\s*강한\s*사주입니다\s*\([^)]+\)/g, type: "yinyang" },
    { pattern: /강점:\s*[^\n]+/g, type: "keyword" },
    { pattern: /약점:\s*[^\n]+/g, type: "keyword" },
    { pattern: /◆[^◆\n]+/g, type: "keyword" },
    { pattern: /#[가-힣a-zA-Z0-9]+/g, type: "hashtag" },
  ];

  const matches = [];
  keywordPatterns.forEach(({ pattern, type }) => {
    let match;
    const regex = new RegExp(pattern.source, pattern.flags);
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
        element: detectElement(match[0], type),
      });
    }
  });

  if (matches.length === 0) return text;

  matches.sort((a, b) => a.start - b.start);

  const filtered = [];
  let lastEnd = -1;
  matches.forEach((m) => {
    if (m.start >= lastEnd) {
      filtered.push(m);
      lastEnd = m.end;
    }
  });

  const result = [];
  let lastIdx = 0;

  filtered.forEach((match, idx) => {
    if (match.start > lastIdx) {
      result.push(text.substring(lastIdx, match.start));
    }
    result.push(
      <Highlight key={`highlight-${idx}`} $element={match.element}>
        {match.text}
      </Highlight>
    );
    lastIdx = match.end;
  });

  if (lastIdx < text.length) {
    result.push(text.substring(lastIdx));
  }

  return result;
};

function SajuResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resultData, setResultData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isFromSaved, setIsFromSaved] = useState(false);

  useEffect(() => {
    // location.state에서 데이터 받기
    if (location.state) {
      const data = location.state.resultData || location.state;
      // 저장된 결과에서 온 것인지 확인
      setIsFromSaved(location.state.isFromSaved || false);

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
      navigate("/saju-input");
    }
  }, [location.state, navigate]);

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
      // api 인스턴스는 interceptor에서 자동으로 토큰을 추가함
      const response = await api.post(`/saju/${resultData._id}/save`, {});

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
          <Title>SAJUBOYS</Title>
          <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "1.2rem" }}>
            데이터를 불러오는 중...
          </p>
        </ContentWrapper>
      </Container>
    );
  }

  return (
    <Container>
      <GradientCircle1 />
      <GradientCircle2 />
      <ContentWrapper>
        <Title>RESULT</Title>

        <SectionWrapper>
          {/* 왼쪽: 불변 정보 */}
          <StickyColumn $sticky>
            <SectionHeader $variant="immutable">
              <h2>💫 타고난 사주의 설계도</h2>
              <p>평생 변하지 않는 타고난 명식</p>
            </SectionHeader>

            {/* 기본 정보 - 안 바뀌는 부분 */}
            <ResultCard $variant="immutable">
              <SectionTitle>📖 기본 정보</SectionTitle>
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

            <ResultCard $variant="immutable">
              <SectionTitle>🎴 사주 팔자</SectionTitle>
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

            {/* 불변 분석 */}
            {(resultData.elements ||
              resultData.yinYang ||
              resultData.fourPillars) && (
              <ResultCard $variant="immutable">
                <SectionTitle>📊 사주 분석 차트</SectionTitle>
                <SajuCharts
                  elements={resultData.elements}
                  yinYang={resultData.yinYang}
                  fourPillars={resultData.fourPillars}
                />
              </ResultCard>
            )}

            {resultData.elements && (
              <ResultCard $variant="immutable">
                <SectionTitle>⚖️ 오행 분석</SectionTitle>
                <FiveElementsGrid>
                  {Object.entries(resultData.elements).map(
                    ([element, count]) => (
                      <ElementItem key={element} element={element}>
                        <div className="element-name">{element}</div>
                        <div className="element-count">{count}</div>
                      </ElementItem>
                    )
                  )}
                </FiveElementsGrid>
                {resultData.interpretation?.elementBalance && (
                  <Description>
                    {highlightText(resultData.interpretation.elementBalance)}
                    <div
                      style={{
                        textAlign: "center",
                        margin: "2rem 0",
                        padding: "1.5rem",
                        background: "rgba(255, 255, 255, 0.03)",
                        borderRadius: "12px",
                      }}
                    >
                      <img
                        src="/src/assets/saju.png"
                        alt="오행 상생상극 다이어그램"
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                          maxHeight: "300px",
                          margin: "0 auto",
                          display: "block",
                        }}
                      />
                      <p
                        style={{
                          marginTop: "1rem",
                          color: "rgba(255, 255, 255, 0.7)",
                          fontSize: "0.9rem",
                          lineHeight: "1.6",
                        }}
                      >
                        <strong style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                          오행 상생상극의 원리
                        </strong>
                        <br />
                        상생(실선): 목→화→토→금→수→목 순환으로 서로 도움
                        <br />
                        상극(점선): 목↔토, 화↔금, 수↔화 관계로 서로 견제
                      </p>
                    </div>
                  </Description>
                )}
              </ResultCard>
            )}

            {/* 대운 섹션 - 불변 */}
            {resultData.daeun && resultData.daeun.length > 0 && (
              <ResultCard $variant="immutable">
                <SectionTitle>🌊 대운</SectionTitle>
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
          </StickyColumn>

          <Divider />

          {/* 오른쪽: 변동 정보 */}
          <Column>
            <SectionHeader $variant="mutable">
              <h2>시운의 흐름 💫</h2>
              <p>시간과 상황에 따라 변화하는 해석</p>
            </SectionHeader>

            {/* 해석 결과 - 바뀌는 부분 */}
            <ResultCard $variant="mutable">
              <SectionTitle>✨ 성격 분석</SectionTitle>
              <Description>
                {highlightText(resultData.interpretation.personality)}
              </Description>
            </ResultCard>

            <ResultCard $variant="mutable">
              <SectionTitle>💼 직업 운</SectionTitle>
              <Description>
                {highlightText(resultData.interpretation.career)}
              </Description>
            </ResultCard>

            <ResultCard $variant="mutable">
              <SectionTitle>💕 연애 운</SectionTitle>
              <Description>
                {highlightText(resultData.interpretation.relationship)}
              </Description>
            </ResultCard>

            {resultData.interpretation.wealth && (
              <ResultCard $variant="mutable">
                <SectionTitle>💰 재물운</SectionTitle>
                <Description>
                  {highlightText(resultData.interpretation.wealth)}
                </Description>
              </ResultCard>
            )}

            {resultData.interpretation.health && (
              <ResultCard $variant="mutable">
                <SectionTitle>🍃 건강운</SectionTitle>
                <Description>
                  {highlightText(resultData.interpretation.health)}
                </Description>
              </ResultCard>
            )}

            {resultData.interpretation?.socialRelationship && (
              <ResultCard $variant="immutable">
                <SectionTitle>🤝 대인관계 & 인간관계 운</SectionTitle>
                <Description>
                  {highlightText(resultData.interpretation.socialRelationship)}
                </Description>
              </ResultCard>
            )}

            {resultData.saeun && (
              <ResultCard $variant="mutable">
                <SectionTitle>🔮 2025년 세운</SectionTitle>
                <Description>
                  올해의 세운: {resultData.saeun.heaven}
                  {resultData.saeun.earth}
                </Description>
              </ResultCard>
            )}

            <ResultCard $variant="mutable">
              <SectionTitle>🌟 총운</SectionTitle>
              <Description>
                {highlightText(resultData.interpretation.fortune)}
              </Description>
            </ResultCard>
          </Column>
        </SectionWrapper>

        {/* 조언 섹션 - 공통 */}
        {resultData.interpretation?.advancedAnalysis?.timelyFortune?.advice && (
          <ResultCard
            style={{
              marginTop: "2rem",
              background:
                "linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(156, 102, 234, 0.08))",
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              border: "1px solid rgba(185, 161, 230, 0.35)",
            }}
          >
            <SectionTitle>💡 올해 행동 가이드</SectionTitle>
            <Description>
              {highlightText(
                resultData.interpretation.advancedAnalysis.timelyFortune.advice
              )}
            </Description>
          </ResultCard>
        )}

        <ButtonGroup>
          {isFromSaved ? (
            // 저장된 결과를 볼 때는 뒤로가기 버튼만 표시
            <Button onClick={() => navigate("/saved-saju")}>
              저장된 목록으로 돌아가기
            </Button>
          ) : (
            // 새로운 결과를 볼 때는 저장하기와 새로운 사주 버튼 표시
            <>
              <Button $primary onClick={handleSaveResult} disabled={saving}>
                {saving ? "저장 중..." : "결과 저장하기"}
              </Button>
              <Button onClick={handleNewReading}>새로운 사주 보기</Button>
            </>
          )}
        </ButtonGroup>
      </ContentWrapper>
    </Container>
  );
}

export default SajuResult;
